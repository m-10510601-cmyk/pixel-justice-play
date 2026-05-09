## Sync BADGE copy to backpack + chapter

Right now the wired effect is "forgives one wrong answer this chapter (keeps that ⭐ and restores perfect bonus)", but two surfaces are stale:

- `src/components/BackpackModal.tsx` — badge entry still says `"Coming soon"`. Used by both Quest backpack and the in-chapter backpack.
- `src/components/story/ChoicePanel.tsx` — `ARMED_META.badge` label is plain `"BADGE"`; should match other items' format.

### Changes

- `BackpackModal.tsx`:
  - `badge: { icon: "🛡", name: "BADGE", desc: "Forgives one wrong answer this chapter" }`
- `ChoicePanel.tsx`:
  - `badge: { icon: "🛡", label: "BADGE · FORGIVE 1" }`

No logic change — Store, StarReward, and the per-chapter forgiveness math are already correct.

summary: Update Backpack item description and in-chapter active-item chip so BADGE matches its actual "forgive one wrong answer" effect on both Quest and chapter backpack views.