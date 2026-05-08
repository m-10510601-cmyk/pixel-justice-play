## Goal
Lock chapters by default. A chapter unlocks only when the previous chapter is **completed** AND the player earned **more than half** of that chapter's maximum stars.

## Unlock rule
- Chapter 1: always unlocked.
- Chapter N (N ≥ 2): unlocked only if for Chapter N-1:
  - the story is completed (player reached an ending), AND
  - `getChapterBest(prevSlug) > maxStars(prevSlug) / 2`
- Maximum stars per chapter = `3 (green base) + totalChoices + 2 (perfect bonus)`. We compute it per story from its STORY array.

## Changes

### 1. `src/lib/rewards.ts`
- Add helper `computeMaxStars(story)` that counts choice steps and returns `5 + totalChoices`.
- Add helper `isChapterUnlockEarned(slug, story)` returning `true` if `getChapterBest(slug) > computeMaxStars(story) / 2`.

### 2. New `src/lib/chapters.ts`
- Central registry mapping each chapter slug → `{ route, title, story (imported STORY array) }` in order. (Export each story's STORY from its page or move to data file — simplest: export `STORY` from each `src/pages/story/*.tsx` and import here.)
- Export `isChapterUnlocked(index)` that walks back to check the previous chapter's completion + star threshold.
- "Completed" = `loadProgress(slug)` exists and `progress.i >= progress.total - 1` OR `getChapterBest(slug) > 0` (claiming reward only happens at ending, so star > 0 ⇒ completed).

### 3. `src/pages/Quest.tsx`
- Replace inline `CASES` with the chapters registry.
- For each chapter compute `unlocked`. If locked:
  - Render as a non-clickable card (disabled style, lower opacity, lock icon 🔒).
  - Show small hint: "Earn more than half stars in Chapter X to unlock".
  - Prevent navigation (use `<div>` instead of `<Link>`).
- Unlocked chapters render as today.

### 4. Story pages (each `src/pages/story/*.tsx`)
- Export the `STORY` constant so `chapters.ts` can import it (currently local). Minimal change: `export const STORY = [...]`.

### 5. (Optional) `src/components/LevelDetailsModal.tsx`
- If it lists chapters, mirror the lock state visual (skip if not used for chapter list).

## Notes
- All gating is client-side via existing `localStorage` (`rewards.v1`, `progress.v1`) — no backend change.
- Threshold uses strict `>` half (e.g., max 8 → need ≥ 5). If you'd prefer `≥` half, that's a one-character tweak.
