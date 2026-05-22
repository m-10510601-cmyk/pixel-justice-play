## Goal

On `/quest` (and every other page), when Settings → Music is OFF, no background music can ever play, even after route changes, reloads, or user interactions that unlock autoplay.

## Likely cause

`src/game/BgmController.tsx` already has guards, but two paths can still leak audio specifically when arriving at `/quest`:

1. **Stale autoplay-unlock listeners.** Each time a route change happens while Music is ON, the controller may register `pointerdown`/`keydown` `resume` listeners (when autoplay was blocked). If the user toggles Music OFF afterwards and then interacts on `/quest` (the Tutorial modal forces a click), every previously-registered `resume` fires. Each one calls `a.play()` inside a Promise; even though we re-check `enabledRef` after, the browser may briefly emit audio before `hardStop()` runs on the next microtask, and on some browsers the play succeeds with audible output.
2. **Audio element keeps a loaded `src`.** When disabled, we still assign `a.src = TRACKS[next]` and only `pause()` it. Any stray `play()` (from a leftover resume listener, a focus/visibility event, or a media-session resume) will immediately produce sound because the buffer is ready.

## Plan (single file: `src/game/BgmController.tsx`)

1. **Track pending resume listeners and clear them on disable.**
   - Keep a `resumeListenersRef = useRef<Array<() => void>>([])`.
   - When registering a `resume` for `pointerdown`/`keydown`, push a cleanup closure that removes both listeners.
   - Add a `clearResumeListeners()` helper that runs all cleanups and empties the array.
   - Call `clearResumeListeners()` from `hardStop()` so disabling music also kills every deferred play.

2. **Refuse to schedule new resume listeners when disabled.**
   - In `tryPlay`'s catch, bail out (no `addEventListener`) if `!enabledRef.current`.

3. **Detach the source when disabled.**
   - In the route-change effect's "music off" early-return branch, do NOT set `a.src = TRACKS[next]`. Only update `currentRef.current = next`, then call `hardStop()` and (defensively) `a.removeAttribute("src"); a.load();`.
   - In the `bgmEnabled` / `volume` effect, when turning OFF call `hardStop()` and `a.removeAttribute("src"); a.load();` so the element holds no playable buffer.
   - When turning back ON, look up the current route's track from `currentRef.current` (or recompute via `trackForPath(window.location.pathname)`), set `a.src = TRACKS[...]`, then `a.play()` + `fadeTo(computeTarget())`.

4. **Re-run the route effect on `bgmEnabled` flips.**
   - Add `bgmEnabled` to the route effect's dependency list so toggling back ON immediately starts the correct track for the current route (today this depends solely on `pathname`).

5. **Guard `play()` resolution one more time.**
   - Keep the existing post-`play().then` `hardStop()` check, plus an `a.pause()` inside the same tick to cover the race.

## Verification

- On `/`, toggle Music OFF → navigate to `/quest` → dismiss the Tutorial modal (forces a click) → no music. Click around on chapter buttons → no music.
- Reload on `/quest` with Music OFF → click anywhere → no music.
- Music OFF with Sound at 100% on `/quest` → silence.
- Toggle Music ON while on `/quest` → `quest.mp3` (mystery) starts and fades in.
- Toggle OFF mid-fade on `/quest` → silence within a frame.
- Repeat for `/store`, `/case/*`, `/story/*` to confirm no regression.

No changes to `SettingsContext`, Settings UI, `Quest.tsx`, or any other file.
