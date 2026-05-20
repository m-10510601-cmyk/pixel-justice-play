## Goal

When the **Music** toggle in Settings is OFF, all background music must be silenced on every page, regardless of the **Sound** volume value (1%–100%).

## Findings

- `BgmController` (mounted globally in `src/App.tsx`) is the only source of background music — no other `<audio>`, `Audio()`, or `.mp3` playback exists outside of it (`playCue` is a synthesized SFX beep, not music).
- Current logic already pauses on `!bgmEnabled`, but a few gaps can let audio resume:
  1. The deferred autoplay-unlock listener in the route-change effect is registered with `{ once: true }`, but only the path that triggers the listener is gated by `enabledRef`. A second route change while OFF can re-register a fresh listener, and any in-flight `a.play()` promise from before the toggle can still resolve and start playback before the pause effect runs.
  2. `targetVolume` is captured in the route-change effect's closure. If the route changes between renders while `bgmEnabled` flips, the closure may still fade to the old non-zero target.
  3. There is no hard guard inside `tryPlay` / `swap` against `enabledRef.current === false` at the moment `play()` actually resolves.

## Plan (single file: `src/game/BgmController.tsx`)

1. **Hard stop helper** — add `const hardStop = () => { if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current); a.volume = 0; a.pause(); }`.
2. **`bgmEnabled` / `volume` effect** — when `!bgmEnabled`, call `hardStop()` immediately (no fade) in addition to the existing fade, so music is silenced even if a `play()` promise resolves after the fade scheduling.
3. **Route-change effect** — at the very top, if `!enabledRef.current`, just update `currentRef` and `a.src`, then `hardStop()` and return. Do not schedule any fade or `tryPlay`.
4. **`tryPlay` resolution guard** — after `a.play()` resolves successfully, re-check `enabledRef.current`; if false, call `hardStop()`.
5. **Autoplay-unlock listener** — keep the `enabledRef` guard, and also call `hardStop()` inside `resume` when disabled, to defensively kill any partial buffer.
6. **Recompute volume from ref inside fades** — replace the captured `targetVolume` in the route effect with a fresh read at fade time, so a mid-fade toggle to OFF immediately fades to 0 instead of the stale target.

## Verification

- Settings → Music OFF on Home → click around, navigate to `/quest`, `/store`, a `/story/*` page, a `/case/*` page → silence on every page.
- Music OFF → reload page → no audio after first click/keypress.
- Music OFF with Sound at 100% → silence.
- Toggle Music back ON on any page → correct track for current route resumes and fades in.

No changes to `SettingsContext`, Settings UI, or any other file.