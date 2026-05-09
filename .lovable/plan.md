## Bug

Items selected from the backpack are consumed but their gameplay effects don't actually appear in-chapter. Audit:

| Item | Current state |
|---|---|
| TIME FREEZE (scroll) | Wired (timer freezes, no penalty) |
| XP +50% / +100% (scales / robe) | Wired in `StarReward` |
| **STAR +1 (gavel)** | **Not wired — no effect** |
| **LAW BOOK (book)** | **Not wired — no effect** |
| BADGE | Vague effect, no matching system — leave as no-op for now |

Also: nothing inside the chapter UI tells the player that an item is currently active, so the boost feels invisible even when it is working.

## Fix

### 1. STAR +1 (gavel) — `src/components/story/StarReward.tsx`
- Read `getArmedItem(slug)`. If `gavel`, add `+1` to `breakdown.total` (and to displayed "Ending bonus" line as `🎁 GAVEL +⭐ 1`).
- Pass the boosted total to both `claimChapterReward` and the XP calculation, so the extra star also converts into a coin reward when it improves the best score.

### 2. LAW BOOK (book) — `src/components/story/ChoicePanel.tsx`
- Read `getArmedItem(caseSlug)`. If `book`, deterministically hide one wrong option per decision panel:
  - "Wrong" = `!opt.best && !opt.ok`.
  - Pick the first wrong option in the list to hide (stable, no randomness so re-renders don't shuffle).
  - Hidden option is filtered out of `options` before rendering. Verdict logic is unaffected (player just has fewer wrong choices to consider).
- Show a small chip in the header: `📕 LAW BOOK · −1 OPTION`.

### 3. Active-item indicator — `src/components/story/ChoicePanel.tsx`
- When any item is armed for the chapter, render a one-line chip near the header showing the active item (icon + short name), so the player can confirm the effect is in play. Reuse the icon/name map already used in `BackpackModal`.

### 4. Verify already-wired effects
- `scroll` → ChoicePanel timer skips `setInterval` and `recordDecisionTime` is forced to `0`. Confirm display reads `❄ FROZEN`.
- `scales` / `robe` → `StarReward` shows `⚖ ×1.5` / `⚖ ×2.0` line under the XP row.

## Files

- `src/components/story/StarReward.tsx` — add gavel star bonus, surface in breakdown UI.
- `src/components/story/ChoicePanel.tsx` — book option-hiding + active-item chip.
- (No changes needed to `SettingsContext`, `BackpackModal`, or `Store`.)

## Out of scope

- Badge "improves defense" — no matching mechanic exists; will remain a placeholder until a defense system is defined.

summary: Wire the missing item effects (gavel adds +1 star at chapter end, law book removes one wrong option per decision) and add an in-chapter chip showing the active item so the boost is visible.