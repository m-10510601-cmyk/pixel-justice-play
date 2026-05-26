## Username System (local-only)

### 1. Storage in SettingsContext
- Add localStorage key `lawguardian.username.v1`.
- Extend `SettingsContext` with `username: string`, `setUsername(name: string)`, and persist on change. Include in autosave STATIC_KEYS list (`src/lib/autoSave.ts`).
- Validation: trim, 2–16 chars, allow letters/numbers/`_-` and CJK characters. Reject empty.

### 2. First-launch prompt (after Terms)
- New component `src/components/UsernameGate.tsx`: shows a `Modal` (non-dismissible) when `agreedTerms === true && !username`.
- Pixel-styled input + "CONFIRM" button. Shows inline validation error. Default suggestion: `Guardian####` (random digits) prefilled.
- Mount in `App.tsx` right after `<TermsGate />` so it gates the home screen until set.

### 3. HUD display (Index.tsx)
- In the top-left gold box, render username next to the avatar with `pixel text-[10px] text-white pixel-text truncate max-w-[80px]`.
- Order: Avatar | Username | 🪙 | LevelBadge. Tapping the username opens `AvatarDetailsModal` (same as avatar).

### 4. Avatar details modal edit
- In `AvatarDetailsModal.tsx`, add a small "NAME" row inside the existing scrollable area: shows current username + pencil button → switches to inline input with Save/Cancel. Uses same validation as the gate.

### 5. i18n strings
- Add keys to translation map in `SettingsContext`: `username.title`, `username.placeholder`, `username.confirm`, `username.error_length`, `username.error_chars`, `username.label`, `username.edit`, `username.save`, `username.cancel`.

### Out of scope
- No auth, no backend table, no uniqueness checks, no triumph/share integration (per your answers).

### Files touched
- `src/game/SettingsContext.tsx` (state + persistence + i18n)
- `src/lib/autoSave.ts` (add key)
- `src/components/UsernameGate.tsx` (new)
- `src/App.tsx` (mount gate)
- `src/pages/Index.tsx` (HUD display)
- `src/components/AvatarDetailsModal.tsx` (edit row)
