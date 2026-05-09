# Remove Translation System — English Only

Strip the entire i18n/translation infrastructure (English / 华文 / B. Melayu) and keep all UI text in English. Story/case content already authored as `LocStr` ({en, zh, ms}) will simply read the `.en` field.

## Changes

### 1. `src/game/SettingsContext.tsx`
- Remove `Lang` type, `DICT` (the zh/ms dictionaries) — keep only the English dict as a plain `Record<string,string>`.
- Remove `lang`, `setLang` from context state, provider value, and `useSettings` consumers' contract.
- `t(key)` becomes a simple lookup against the English dict (fallback to key).
- Remove any `localStorage` persistence for `lang`.

### 2. Delete files
- `src/lib/i18nLive.ts` (live translate cache + edge call)
- `src/components/T.tsx` (T component + `useT` hook)
- `supabase/functions/translate/index.ts` (translate edge function) + remove its block from `supabase/config.toml` if present.

### 3. `src/data/cases.ts` and call sites
- Keep `LocStr` type for compatibility OR simplify. Simplest path: keep `LocStr` definition, change helper `L(lang, s)` → `L(s)` that returns `s.en` (or the string if already a string). Update every `L(lang, x)` call to `L(x)`.
- Files affected: `Brief.tsx`, `Legal.tsx`, `VerdictPage.tsx`, `Evidence.tsx`, `Result.tsx`, `Quest.tsx`, plus any chapter/story page using `L(lang, ...)`.

### 4. Settings page (`src/pages/Settings.tsx`)
- Remove the Language row (3-button zh/ms/en grid) entirely. Keep brightness, sound, BGM, terms, feedback, inbox.

### 5. Remove `<T>` and `useT` usages
- All story pages (`SilentFall`, `GreenTrade`, `DarkNight`, `HighPayTrap`, `MaskOfAuthority`, `RitualOfPower`, `SilentDormitory`, `SilentRoom`, `TheRunner`) and components (`StarReward`, `SceneDialogue`, `EvidenceBoard`, `ChoicePanel`, `LevelUpQuizModal`, `LevelDetailsModal`, `LevelBadge`, `AvatarBadge`, `AvatarPickerModal`, `HomeOverlays`, `InboxModal`, `TermsGate`, `CaseFrame`, etc.):
  - Replace `<T>text</T>` → `text` (plain JSX text).
  - Replace `useT(x)` → `x`.
  - Remove `import T, { useT } from "@/components/T"` lines.
- Remove any `lang` destructuring from `useSettings()` calls and any `Lang` imports.

### 6. Cleanup
- Delete `lang.zh`, `lang.ms`, `lang.en`, `settings.language` keys from English dict (no longer referenced).
- Remove any subscriber wiring for `subscribeI18n`.

## Out of scope
- No changes to game logic, story content, RLS, edge `feedback-inbox`, audio, or layout.
- Existing `LocStr` story data stays as-is; only the rendering helper changes to always pick `.en`.

## Verification
- TypeScript build passes (no remaining `lang`/`Lang`/`<T>`/`useT` references).
- Settings page no longer shows Language row.
- Story pages render English text unchanged.
- No network calls to `/functions/v1/translate`.
