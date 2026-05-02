# Restructure: Unified Case Selection Hub

## Goal
Remove the two-tier navigation (Quest → School/Society → Cases). After tapping START on the home screen, the player lands directly on a single **Case Selection Hub** that lists all 8 story chapters in one scrollable grid.

## Current Flow (to remove)
```text
Index (/) → Quest (/quest) → Chapter (/chapter/school | /chapter/society) → Story page
```
- `/quest` shows two big gateway tiles (School / Society)
- `/chapter/:chapter` filters stories by chapter and lists them

## New Flow
```text
Index (/) → Case Hub (/quest) → Story page
```
A single hub page with all cases in one list (no school/society split).

## Changes

### 1. Rewrite `src/pages/Quest.tsx` → Case Selection Hub
- Remove the two `Link` tiles to `/chapter/school` and `/chapter/society`.
- Replace with one scrollable list of 8 case cards (same `pixel-btn` styling currently used in `Chapter.tsx`), each linking directly to its `/story/...` route.
- Keep the existing tutorial modal trigger and header/back button.
- Cases to include (in order):
  1. Chapter X · Silent Fall → `/story/silent-fall`
  2. Chapter Y · The Green Trade → `/story/green-trade`
  3. Chapter W · The Silent Dormitory → `/story/silent-dormitory`
  4. Chapter Z · The Runner → `/story/the-runner`
  5. Chapter W · The Silent Room → `/story/silent-room`
  6. Chapter V · The Mask of Authority → `/story/mask-of-authority`
  7. Chapter U · The Ritual of Power → `/story/ritual-of-power`
  8. Chapter T · The High-Pay Trap → `/story/high-pay-trap`
- Use `justiceBg` as the background (neutral), drop the school/society split-preview imagery.
- Title: reuse `t("quest.title")` (or simple "CASE FILES" text).

### 2. Delete `src/pages/Chapter.tsx` and its route
- Remove the `import Chapter` line and the `<Route path="/chapter/:chapter" ...>` from `src/App.tsx`.
- Delete the file `src/pages/Chapter.tsx`.

### 3. Leave untouched
- `src/data/cases.ts` (already empty `CASES[]`, no school/society data to remove).
- All `src/pages/story/*.tsx` files — routes and content unchanged.
- Home (`Index.tsx`) START button still points to `/quest`.

## Notes
- No translation keys need to be added; existing `quest.title` is reused. The school/society translation keys can stay unused (harmless).
- This is a UI/routing-only change; no data, no backend, no asset changes.
