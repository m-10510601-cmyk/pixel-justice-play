## Goal
When the user toggles Music OFF in Settings, the background music should stop immediately and stay off — including across page navigation and user clicks.

## Root cause
`src/game/BgmController.tsx` already pauses on `bgmEnabled = false`, but two paths can resurrect playback while music is off:

1. **Pending autoplay-unlock listener** — When autoplay is blocked, the controller registers a `pointerdown`/`keydown` listener that calls `a.play()` on the next user interaction. This listener does not re-check `bgmEnabled`, so toggling Music OFF and then clicking anywhere starts the music.
2. **Route change while OFF** — On every route change, `swap()` unconditionally calls `a.play()` (then fades to volume 0). The track is silent but actually playing in the background, which is wrong intent and risks audible blips.

## Fix (single file: `src/game/BgmController.tsx`)

1. Track `bgmEnabled` in a ref (`enabledRef`) so the deferred resume listener always sees the latest value.
2. In the autoplay-unlock `resume` callback, bail out (and do not re-arm) if `enabledRef.current === false`.
3. In the route-change effect, skip `tryPlay()` when `bgmEnabled` is false — just update `currentRef`/`src` so the correct track is queued for when music gets re-enabled.
4. In the `bgmEnabled`/`volume` effect, when turning back ON, if `a.src` is set but paused, call `a.play()` and fade in (already mostly handled — verify path).

No changes to `SettingsContext`, Settings UI, or any other file. Behavior of the Music toggle button itself is unchanged.

## Verification
- Open app → Settings → toggle Music OFF → click around / navigate to Quest, Store, a chapter → confirm silence.
- Toggle Music ON again → confirm correct track resumes for the current route.
- Reload with Music OFF persisted → confirm no audio on first interaction.
