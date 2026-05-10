## Reset scroll on every Next press in chapter pages

**Goal:** When the player advances in any chapter (including past a decision step), the chapter's scroll snaps back to the top so the new content starts from the beginning instead of mid-scroll.

### Where the scroll lives
Each chapter renders content inside `<main className="flex-1 px-5 py-4 overflow-y-auto">` — that `<main>` is the scroll container, not the window. The bottom `NEXT ▶ / REVEAL ENDING ▶` button calls `next()`, which increments the step index `i`.

### Change
For each of the 9 chapter files:
- `src/pages/story/DarkNight.tsx`
- `src/pages/story/GreenTrade.tsx`
- `src/pages/story/HighPayTrap.tsx`
- `src/pages/story/MaskOfAuthority.tsx`
- `src/pages/story/RitualOfPower.tsx`
- `src/pages/story/SilentDormitory.tsx`
- `src/pages/story/SilentFall.tsx`
- `src/pages/story/SilentRoom.tsx`
- `src/pages/story/TheRunner.tsx`

Apply the same minimal edit:
1. Add `const mainRef = useRef<HTMLElement>(null)` and attach it to the `<main>` scroll container.
2. Add an effect keyed off `i`:
   ```ts
   useEffect(() => {
     mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
     window.scrollTo(0, 0);
   }, [i]);
   ```

This guarantees every step transition — including out of a decision/choice step ("including decision") and the final `REVEAL ENDING` press — starts at the top.

### Why this approach
- Triggers off `i` instead of wiring into `next()` directly, so it also covers the header back-arrow and restart-to-0.
- Instant scroll (`behavior: "auto"`) matches the snappy pixel feel.
- Touches presentation only — no changes to game logic, BGM, progress, or decision handling.

### Out of scope
- No changes to `ChoicePanel`, `SceneDialogue`, `EvidenceBoard`, BGM controller, or progress hook.
- No new shared hook — keeps each diff small and easy to revert.