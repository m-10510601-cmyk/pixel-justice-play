## Problem

In `src/pages/Index.tsx`, the top HUD has two clusters:
- Left: gold box with avatar + username + coins + level
- Right: three square buttons (Daily, Cloud Save, Feedback)

When the username is long, the left gold box grows and pushes the right buttons outside the ornate frame on both mobile and desktop. Username currently has `max-w-[88px] truncate` but the surrounding gold box still expands because the parent flex row lets it grow, and on narrow viewports the right cluster gets clipped.

## Fix (UI only, in `src/pages/Index.tsx`)

1. **Cap the left cluster width** so it can shrink:
   - Change the left gold box wrapper from `shrink-0` to `min-w-0 flex-1` with a hard `max-w-[60%]` (so the right buttons always reserve ~40%).
   - Add `min-w-0` to inner flex so truncation actually triggers.

2. **Tighten the username chip** so it truncates earlier on small screens and never dominates:
   - Replace `max-w-[88px]` with responsive `max-w-[64px] sm:max-w-[120px]`.
   - Keep `truncate` and `title={username}` so the full name is still accessible on hover/long-press.

3. **Keep right cluster always visible**:
   - Keep `shrink-0` on the right buttons container.
   - Reduce gap on very small screens: change outer wrapper gap from `gap-3` to `gap-2 sm:gap-3`.
   - Make the three right buttons slightly smaller on mobile (28px) and 34px on `sm:` so all three always fit beside even a max-truncated name.

4. **No changes** to logic, state, styles tokens, or any other component. No changes to `UsernameGate` validation (16-char cap already enforces an upper bound; this plan handles display only).

## Verification

- Mobile (~360px): all three right buttons visible; long username truncates with ellipsis inside the gold box.
- Desktop (≥640px): username shows up to ~120px before truncating; right buttons unaffected.
- Avatar, coin, and level badge remain visible and clickable.
