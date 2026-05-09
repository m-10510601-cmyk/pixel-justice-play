## Update item copy to match actual effects

### Store (`src/pages/Store.tsx`)

| Item | New name | New description |
|---|---|---|
| `gavel` | STAR +1 | "Adds +1 ⭐ to this chapter's reward" |
| `book` | LAW BOOK | "Hides one wrong option in every decision this chapter" |
| `scroll` | TIME FREEZE | "Freezes the decision timer this chapter — no time penalty" *(unchanged, already accurate)* |
| `scales` | XP BOOST +50% | "This chapter XP ×1.5 (rounded)" |
| `robe` | XP BOOST +100% | "This chapter XP ×2 (rounded)" |
| `badge` | BADGE | Mark as `(coming soon)` since no effect is wired |

### Backpack (`src/components/BackpackModal.tsx` `ITEM_META`)

| Item | New name | New description |
|---|---|---|
| `gavel` | STAR +1 | "Adds +1 ⭐ at chapter end" |
| `book` | LAW BOOK | "Hides one wrong option per decision" |
| `scroll` | TIME FREEZE | "Freezes decision timer — no time penalty" |
| `scales` | XP +50% | "This chapter XP ×1.5" |
| `robe` | XP +100% | "This chapter XP ×2" |
| `badge` | BADGE | "Coming soon" |

### Notes
- Names stay short to fit the existing pixel UI.
- One-item-per-chapter rule is unchanged; copy just describes what each does when used.
- No logic changes — only string updates in two files.

summary: Rewrite Store and Backpack item names/descriptions so they accurately reflect the wired effects (gavel = +1 star this chapter, law book = hide one wrong option per decision, XP boosts apply this chapter, time freeze unchanged, badge labelled coming soon).