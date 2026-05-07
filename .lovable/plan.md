## Replace letter chapter labels with numbers

Each story page has a header like `CHAPTER X · SILENT FALL`. Replace the letter with the numeric chapter from the Quest list:

- `src/pages/story/SilentFall.tsx` (line 292): `CHAPTER X` → `CHAPTER 1`
- `src/pages/story/GreenTrade.tsx` (line 473): `CHAPTER Y` → `CHAPTER 2`
- `src/pages/story/SilentDormitory.tsx` (line 504): `CHAPTER W` → `CHAPTER 3`
- `src/pages/story/TheRunner.tsx` (line 558): `CHAPTER Z` → `CHAPTER 4`
- `src/pages/story/SilentRoom.tsx` (line 477): `CHAPTER W` → `CHAPTER 5`
- `src/pages/story/MaskOfAuthority.tsx` (line 484): `CHAPTER V` → `CHAPTER 6`
- `src/pages/story/RitualOfPower.tsx` (line 493): `CHAPTER U` → `CHAPTER 7`
- `src/pages/story/HighPayTrap.tsx` (line 505): `CHAPTER T` → `CHAPTER 8`
- `src/pages/story/DarkNight.tsx` (line 490): `CHAPTER S` → `CHAPTER 9`

Cross-references inside narrative text (e.g. "Chapter 4", "Chapter X · Silent Fall", "Chapter Y ‘Green Trade’") will also be normalized to the numeric form for consistency.