## Goal
Add a unique pixel-art scene image to each of the 6 cases, displayed as an immersive header in the Case Brief phase.

## Cases needing art

**School chapter:**
1. `school-1` Missing Laptop — pixel computer lab with empty desk
2. `school-2` Exam Cheating — pixel exam hall, rows of desks
3. `school-3` Bullying — pixel school hallway confrontation

**Society chapter:**
4. `society-1` Investment / Online Fraud — pixel desk with computer + scam screen
5. `society-2` Neighbor Dispute — pixel apartment doorway argument
6. `society-3` Workplace Negligence — pixel construction/factory site

## Changes

### 1. Generate 6 pixel-art images
Use the image generator to create six 2:3 (or square, cropped) pixel-art scenes matching the case themes. Save to `src/assets/`:
- `case-school-laptop.jpg`
- `case-school-exam.jpg`
- `case-school-bullying.jpg`
- `case-society-fraud.jpg`
- `case-society-neighbor.jpg`
- `case-society-workplace.jpg`

### 2. `src/data/cases.ts`
Add an optional `image: string` field to the `CaseData` type and import + assign the matching asset to each of the 6 cases.

### 3. `src/pages/case/Brief.tsx`
Render the case's `image` as a header banner above the brief text:
- Full-width inside the panel
- Fixed pixel-art aspect (e.g. `aspect-[3/2]`), `object-cover`
- Pixel-perfect rendering (`image-rendering: pixelated`)
- Subtle inset border to match the pixel-frame style
- Falls back gracefully if `image` is missing

### 4. (Optional) Carry the image into Evidence/Result headers
Out of scope unless you want it — Brief only for now.

## Verification
Open each of the 6 cases → Brief phase shows its unique scene image at the top of the card.

## Out of scope
No changes to case logic, evidence, scoring, translations, or items.
