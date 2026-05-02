# Plan: Show Characters in Dialogue Scenes (Silent Fall)

Goal: When a dialogue line is spoken, display a pixel-art character portrait beside the text — like a classic visual novel — so scenes feel alive instead of just text on a card.

## What the user will see

For each `scene` step with dialogue:
- A character portrait appears on the left (or right, alternating by speaker) of each line.
- The currently-speaking character is highlighted (full color + slight bounce); others would be dimmed if shown.
- "Inner thoughts" (the player's own reflection) show the player avatar with a thought-bubble style frame instead of a speech tone.
- Narration lines (no `who`) show no portrait, just italic narration text — keeps pacing clean.
- A small nameplate above each speech bubble shows the speaker's name in pixel font.

Speakers that need portraits in the current story:
- Principal (middle-aged man, formal shirt, glasses)
- Aira's Parent (worried adult, simple blouse)
- You / Player (the guardian — reuse the existing `AvatarBadge` style, scaled up)
- Aira (referenced in flashback evidence — optional small portrait in evidence cards too)

## How it will be built

1. New component `src/components/story/CharacterPortrait.tsx`
   - Pure CSS/divs pixel-art portraits (no image assets needed) in the same style as `AvatarBadge.tsx`.
   - Props: `character: "principal" | "parent" | "you" | "aira"`, `size?: number`, `speaking?: boolean`.
   - Each character defined as a small set of colored pixel blocks (hair, face, eyes, mouth, clothing collar). ~30–40 lines per character.
   - When `speaking`, add `animate-bob` (gentle 2px up/down) and full opacity; otherwise dim to 60%.

2. New component `src/components/story/DialogueLine.tsx`
   - Renders one line: `[portrait] [nameplate + bubble]`.
   - Alternates portrait side based on speaker (Principal left, Parent right, You center-left as inner monologue with dashed border).
   - Uses existing pixel UI tokens: `bg-card/90`, `border-2 border-primary`, `pixel` font, `text-plate` for high contrast.
   - Inner thoughts: italic + dashed border + "💭" prefix in nameplate.

3. Update `src/pages/story/SilentFall.tsx`
   - Extend the `scene` line type with optional `character` field (auto-mapped from `who` string for backwards compatibility — e.g. `"Principal"` → `principal`).
   - Replace the current scene render block to map each line to `<DialogueLine>` instead of inline text.
   - Keep narration (lines with no `who`) rendered as plain text above/between bubbles.
   - Add a subtle scene-title banner at the top of each scene (unchanged styling).

4. Minor CSS in `src/index.css`
   - `@keyframes speak-bob` (2px translateY, 0.9s ease-in-out infinite) and `.speak-bob` utility.
   - `.dialogue-bubble` with a small pixel "tail" pointing toward the portrait (made with a rotated bordered square).

## Technical notes

- No new image assets — portraits are CSS pixel art so they stay crisp at any zoom and match the retro aesthetic.
- Backwards compatible: existing `STORY` data only needs `who` strings; the component infers the character key. New optional `character` field lets us override (e.g. for Aira flashbacks).
- Choice / evidence / insight steps are unchanged.
- Mobile: portraits sized 56×56 px so two-column layout (portrait + bubble) still fits the 2:3 vertical viewport.

## Files

- create `src/components/story/CharacterPortrait.tsx`
- create `src/components/story/DialogueLine.tsx`
- edit `src/pages/story/SilentFall.tsx` (scene render only)
- edit `src/index.css` (add speak-bob keyframes + bubble tail)
