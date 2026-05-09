## Goals

1. XP boost items (XP +50% / XP +100%) apply to the **current chapter** the player is inside, not "next chapter".
2. Add a **decision-time XP penalty**: the longer a player takes to decide on a question, the less XP that chapter awards (max −20%). Penalty starts after **45s**, reaches max at **120s**, and is capped beyond that.
3. Replace the **SCROLL** store item: instead of "hidden hints", it becomes **TIME FREEZE** — when used in a chapter, the deliberation timer is frozen so no time penalty applies that chapter.

## Behaviour details

### Decision-time penalty (per chapter)
- ChoicePanel already runs a per-question deliberation timer (`thinkSec`). We will record the final deliberation seconds for each answered question into a per-chapter store on the Settings context.
- At chapter end, compute the **average per-question deliberation time** and map to a multiplier:
  - `t ≤ 45s` → `1.0` (no penalty)
  - `45s < t < 120s` → linear from `1.0` down to `0.8`
  - `t ≥ 120s` → `0.8` (capped)
- Final XP = `round( baseXp × timeMultiplier × itemBoostMultiplier )`.
- The Star/XP reward panel will display the time multiplier as a small note (e.g. `⏱ ×0.92`) when it is < 1.0.

### Item boost (current chapter)
- When `scales` (XP +50%) or `robe` (XP +100%) is the armed item for the current chapter slug, multiply XP by 1.5 / 2.0 respectively, then `Math.round`.
- Update item descriptions in Store and Backpack from "Next chapter" to "This chapter".

### Time freeze (scroll)
- Store entry `scroll` becomes `TIME FREEZE` (icon ❄, desc "Freezes the decision timer this chapter — no time penalty"). Price unchanged (80).
- When `scroll` is the armed item for the current chapter, the per-question timer in `ChoicePanel` is frozen at `00:00` (display only) and the recorded deliberation time is forced to `0`, so `timeMultiplier` is always `1.0`.

## Files

- `src/game/SettingsContext.tsx`
  - Add session-only state: `decisionTimesByCase: Record<slug, number[]>` and helpers `recordDecisionTime(slug, seconds)`, `getAvgDecisionTime(slug)`, `clearDecisionTimes(slug)`.
  - Add helper `getXpMultiplierForCase(slug)` that combines time penalty + armed item boost (treats `scroll` as freeze, `scales` as ×1.5, `robe` as ×2.0).
  - Reset `decisionTimesByCase` when a new play of a chapter begins (same lifecycle as `usedItemsByCase`).

- `src/components/story/ChoicePanel.tsx`
  - On confirm (`onSelect`), call `recordDecisionTime(caseSlug, thinkSec)`.
  - If the armed item for `caseSlug` is `scroll`, freeze the timer (skip the `setInterval` increment) and show a small `❄ FROZEN` chip in place of the live `mm:ss`.

- `src/components/story/StarReward.tsx`
  - Replace `const xpGain = breakdown.total * 10;` with:
    - `const baseXp = breakdown.total * 10;`
    - `const mult = getXpMultiplierForCase(slug);` (returns `{ time, item, total }`)
    - `const xpGain = Math.round(baseXp * mult.total);`
  - Show a small breakdown line under the XP row when any multiplier ≠ 1.0:
    - e.g. `⏱ ×0.92  ·  ⚖ ×1.5  →  +27 XP`.
  - Pass through to `addXp` as before.

- `src/components/BackpackModal.tsx`
  - Update `scroll` meta to `{ icon: "❄", name: "TIME FREEZE", desc: "Freezes the decision timer this chapter" }`.
  - Update `scales` desc → `"This chapter XP +50%"`.
  - Update `robe` desc → `"This chapter XP +100%"`.

- `src/pages/Store.tsx`
  - `scroll` row: name `TIME FREEZE`, icon `❄`, desc `"Freezes the decision timer this chapter — no time penalty"`.
  - `scales` desc → `"This chapter XP +50% (rounded)"`.
  - `robe` desc → `"This chapter XP +100% (rounded)"`.

## Out of scope

- No changes to the gavel (STAR +1) or law-book (remove option) effects.
- No changes to per-chapter "one item only" locking rules — already in place.
- No persistence of decision times across sessions (session-only, like armed items).

summary: Apply XP boosts to the current chapter, add a decision-time XP penalty (max −20% between 45s–120s), and replace SCROLL with a TIME FREEZE item that disables the penalty.