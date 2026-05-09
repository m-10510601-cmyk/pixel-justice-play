# Plan: Inventory, Auto-Save, Triumph cleanup

## 1) Store items become a usable inventory in Quest

**Data model (SettingsContext `Meta`)**
- Add `inventory: Record<ItemId, number>` with default 0.
- Item ids: `gavel | book | badge | scroll | scales | robe | timeExt`.
- `timeExt` reuses existing `timeExtensions` count (alias in inventory view) — no double storage.

**Store.tsx**
- On successful `buy(it)`: increment `inventory[it.id]` (new helper `addItem(id, n)`).
- Time Extension purchase already increments `timeExtensions`; surface it as `timeExt` in the inventory map.

**Quest.tsx — new "Tool Belt" panel**
- Strip below header listing every item with count > 0 (and the special-tool `timeExt`).
- Each tool is a small pixel button: icon + count badge.
- Tap → consume one (`useItem(id)`), play cue, show toast "✓ USED <NAME>".
- Items with count 0 render greyed (not clickable) when ever owned, otherwise hidden.
- Special tool (`timeExt`, from Day-7 daily reward) appears in the same belt with a `SPECIAL` label.

**SettingsContext additions**
- `inventory`, `addItem(id, n)`, `useItem(id): boolean` (decrements; for `timeExt` decrements `timeExtensions`).
- Persist within existing `META_LS` key (back-compat: missing field → `{}`).

**Effects**: per user, items are consume-only buffs. For this iteration the consume is recorded but combat math is not wired into case results — UI entry point only (consistent with chosen scope "仅消耗型加成", deferred numeric tuning).

## 2) Global throttled auto-save

**New file `src/lib/autoSave.ts`**
- `snapshot()` reads the four canonical localStorage keys: `lawguardian.meta.v1`, `lawguardian.settings.v1`, `lawguardian.level.v1`, plus all `lawguardian.progress.v1.*`.
- `scheduleAutoSave()` debounced 2 s; writes JSON to `lawguardian.autosave.v1` with `{ ts, data }`.

**Hook `useAutoSave()`**
- Mounted once in `App.tsx`.
- Subscribes to `storage`, plus listens to context changes (`coins`, `level`, `xp`, `inventory`, `meta`) via `useEffect` deps.
- Triggers `scheduleAutoSave()` on any change.

**UI indicator**
- Small `AUTO-SAVED` toast (top-right, fade 1.2 s) shown when a flush completes. Lives in `App.tsx` via lightweight zustand-free event (`window.dispatchEvent(new CustomEvent('lg:autosaved'))`).

**SaveLoadModal**
- Add a third row: "RESTORE AUTO-SAVE" that loads from `lawguardian.autosave.v1` (same flow as existing manual load).

## 3) Triumph cleanup

**src/pages/Triumph.tsx**
- Delete the `TRUTH SEEKER / hidden evidence` entry (id 3) from `achievements`.
- Renumber ids; completion bar recalculates automatically.

## Out of scope
- Wiring item buffs into verdict scoring math.
- Cloud (server-side) sync — auto-save is local only (no auth in project).
- New i18n keys (English-only project); strings inline.

## Files touched
- `src/game/SettingsContext.tsx` — inventory state + helpers.
- `src/pages/Store.tsx` — add to inventory on buy.
- `src/pages/Quest.tsx` — Tool Belt panel.
- `src/lib/autoSave.ts` (new) + `src/App.tsx` — global auto-save + toast.
- `src/components/HomeOverlays.tsx` — SaveLoadModal restore button.
- `src/pages/Triumph.tsx` — remove achievement.
