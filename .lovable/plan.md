## Plan — Always-visible Backpack + In-chapter usage

### Goal
- Backpack icon visible **always** (even with empty inventory) at top-right of Quest page AND inside chapter answering pages.
- Opens a panel listing all owned items + counts.
- Using an item consumes 1 immediately, locks all OTHER items for that chapter, and prevents re-using the same item again in that chapter.

### 1) `src/game/SettingsContext.tsx` — adjust rules
Current `usedItemsByCase: Record<slug, ItemId>` enforces "one item per play across all chapters". Change semantics to **per-chapter**:
- Keep shape `Record<slug, ItemId[]>` (array of items used in this chapter, session-only).
- `armItemForCase(slug, id)` rules:
  - If `usedItemsByCase[slug]` already contains any item → only allow if id matches (same item reuse) — but block since "same item only once per chapter".
  - So: if array exists and length ≥ 1 → reject (locks other items + same item again).
  - Else: push id, decrement inventory by 1.
- Add helper `getUsedItemsForCase(slug): ItemId[]`.
- Remove the global "one per play" restriction (now per-chapter).
- Reset `usedItemsByCase` on new play / when leaving (session-only stays).

### 2) New component `src/components/BackpackButton.tsx`
- Floating/inline button: 🎒 icon + small badge showing total item count (or "0").
- Always renders (even when empty).
- On click → opens `BackpackModal`.

### 3) New component `src/components/BackpackModal.tsx`
Props: `caseSlug?: string` (when inside a chapter), `onClose`.
- Lists all known items (gavel/book/badge/scroll/scales/robe) with icon, name, owned count.
- If `caseSlug` given:
  - Determine `usedHere = getUsedItemsForCase(slug)`.
  - If `usedHere.length > 0` → all items disabled, show "ITEM ALREADY USED THIS CHAPTER".
  - Else → each owned item shows "USE" button. Clicking → `armItemForCase(slug, id)` → toast `✓ USED <name>` → close modal.
- If no `caseSlug` (Quest page) → items show count only, no USE button + helper text "Open inside a chapter to use items".
- Empty state: "Backpack is empty — visit the Store."

### 4) `src/pages/Quest.tsx`
- Replace current backpack strip with a top-right `<BackpackButton />` in the header (next to title, opposite back button).
- Remove `pendingItem` arming flow (no longer needed — usage happens inside chapter via modal).
- Remove "USE HERE" / per-chapter arm badge logic on chapter cards (or keep a small "🎒 USED" indicator if `getUsedItemsForCase(slug).length > 0`).

### 5) Chapter answering page — add backpack
The answering UI lives in `src/components/story/ChoicePanel.tsx` (used by all `src/pages/story/*.tsx`). Story pages render via `useStoryProgress` and a wrapper. Best insertion: in each story page's frame header — but to avoid touching 9 files, add it to `ChoicePanel`'s top-right corner OR to the shared frame.
- Option chosen: add `<BackpackButton caseSlug={slug} />` inside `ChoicePanel` header strip (top-right next to the timer chip). Slug derived from `useLocation().pathname.replace("/story/","")`.

### 6) Out of scope (future)
- Actual gameplay effects of items (STAR+1, remove option, XP×1.5/×2). This plan only wires UI + consumption + locking. Effects added later by reading `getUsedItemsForCase(slug)` in StarReward / ChoicePanel.

### Files
- `src/game/SettingsContext.tsx`
- `src/components/BackpackButton.tsx` (new)
- `src/components/BackpackModal.tsx` (new)
- `src/pages/Quest.tsx`
- `src/components/story/ChoicePanel.tsx`
