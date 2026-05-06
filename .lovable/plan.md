## Plan

Replace `src/assets/justice-bg.jpg` with the uploaded pixel-art courthouse image.

### Steps
1. Copy `user-uploads://photo_2026-05-05_22-03-51.jpg` to `src/assets/justice-bg.jpg` (overwrite).
2. No code changes needed — `Index.tsx`, `Quest.tsx`, and other pages already import from `@/assets/justice-bg.jpg`, so the new background will appear everywhere it's used automatically.

### Notes
- All existing overlays (god-rays, stained-glass, dither, ornate frame) in `GameFrame` will continue to layer over the new image. If they make the new clean pixel-art look too busy, we can optionally pass `plain` on selected pages later.