## Generate dedicated pixel-art scene images for The Runner

Replace the 5 reused scene images in `src/pages/story/TheRunner.tsx` with 7 chapter-specific pixel-art illustrations that match each beat of the Singapore impersonation-scam case.

### New images (generated via Nano Banana, 1024×1024, pixel-art / 16-bit retro CRT style consistent with existing chapters)

Saved to `src/assets/scenes/runner/`:

1. `runner-brief.png` — Singapore skyline at dusk, Marina Bay silhouette, evidence folder + magnifying glass overlay. Cover image for Case Brief.
2. `runner-call.png` — Mr. Tan (older man) at home holding a landline phone, worried face, speech bubble glyph; Scenes 1 & 2 (The Call, Fear & Manipulation).
3. `runner-door.png` — HDB corridor doorway at night, masked/wigged "officer" receiving a small bag of valuables from resident; Scene 3 (The Collection).
4. `runner-station.png` — Police investigator at a CRT terminal with CCTV stills + map of SG↔MY; Scene 4 (Suspicion) and the three Investigation choices.
5. `runner-arrest.png` — Causeway / Woodlands checkpoint, suspect (40-yr-old man, casual clothes) being detained by officers; Scene 5 (The Arrest).
6. `runner-interrogation.png` — Stark interrogation room, single overhead lamp, suspect across table from detective with evidence file; Scenes 6 & 7 (Interrogation, Breaking Point).
7. `runner-reflection.png` — Empty courtroom at dawn, gavel + scales, faint silhouette of the runner walking away in handcuffs; Ending · Reflection.

Style guide for every image:
- Pixel-art / 16-bit, limited palette aligned with existing scene PNGs (warm amber + deep navy + accent magenta for highlights).
- 1:1 aspect, no text in image, slight CRT scanline feel, cinematic framing.
- No real-world brand marks (no actual M1/MAS logos).

### Code changes

`src/pages/story/TheRunner.tsx`:
- Remove the 5 old imports (`scene-brief`, `scene-office`, `scene-dorm`, `scene-turning`, `scene-final`).
- Add 7 new imports from `@/assets/scenes/runner/…`.
- Re-map each `scene` step's `image` field:
  - Case Brief → `runner-brief`
  - Scene 1 The Call & Scene 2 Fear → `runner-call`
  - Scene 3 The Collection → `runner-door`
  - Scene 4 Suspicion → `runner-station`
  - Scene 5 The Arrest → `runner-arrest`
  - Scene 6 Interrogation & Scene 7 Breaking Point → `runner-interrogation`
  - Ending · Reflection → `runner-reflection`

No other files change. No new components, routes, or dependencies.

### Generation + QA workflow (in default mode)

1. Copy `knowledge://skill/ai-gateway/scripts/lovable_ai.py` to `/tmp/lovable_ai.py`.
2. For each of the 7 prompts, run with `--image --model google/gemini-3.1-flash-image-preview --output src/assets/scenes/runner/<name>.png` (good speed/quality balance).
3. View each generated PNG and confirm: matches scene, no text artifacts, palette consistent across the 7 images, no broken anatomy. Regenerate any image that fails QA (up to 2 retries per image, escalating to `gemini-3-pro-image-preview` if still bad).
4. Update `TheRunner.tsx` imports and mappings.

### Out of scope

- No changes to story text, choices, evidence, or scoring.
- No new images for other chapters (GreenTrade etc.).
- No animations or transitions on the scene image.
