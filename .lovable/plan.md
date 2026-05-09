## BADGE — forgive one wrong answer

When BADGE is the armed item for the current chapter, one wrong answer is "forgiven" so its ⭐ is not lost. Single-use, this chapter only (matches existing per-chapter item rules).

### Mechanic (`src/components/story/StarReward.tsx`)

Currently a chapter star = `base + bestCount + perfectBonus` where:
- `bestCount` = number of decisions where the player picked `best`.
- `perfectBonus = 2` if `bestCount === totalChoices`.

When `getArmedItem(slug) === "badge"`:
- `forgivenBest = Math.min(totalChoices, bestCount + 1)` (cap at total).
- Recompute `perfectBonus = forgivenBest === totalChoices ? 2 : 0`.
- Show a new line in the breakdown: `🛡 BADGE forgive: ⭐ +N` where N = `(forgivenBest - bestCount) + (newPerfectBonus - oldPerfectBonus)`.
- Apply the same gavel/XP/time logic on the forgiven total.

This guarantees: the wrong-answer star isn't deducted, and if forgiveness causes a perfect run, the perfect bonus is also restored.

### Copy updates

- `src/pages/Store.tsx` BADGE row:
  - desc → `"Forgives one wrong answer this chapter — its ⭐ is kept"`.
- `src/components/BackpackModal.tsx` BADGE entry:
  - desc → `"Forgives one wrong answer this chapter"`.
- `src/components/story/ChoicePanel.tsx` `ARMED_META.badge`:
  - label → `"BADGE · FORGIVE 1"`.

### Files
- `src/components/story/StarReward.tsx`
- `src/pages/Store.tsx`
- `src/components/BackpackModal.tsx`
- `src/components/story/ChoicePanel.tsx`

summary: Wire BADGE so it forgives one wrong answer in the current chapter (keeping that decision's star, and restoring the perfect-run bonus if applicable), and update Store/Backpack/in-chapter copy to match.