## Plan — Store/Inventory/Daily调整 + Avatar字体修复

### 1) Avatar 选择字体收紧（在框内）
`src/components/AvatarPickerModal.tsx`
- 把头像名称从 `text-[9px]` 改为 `text-[7px]`，加 `truncate w-full px-1 block`，并把按钮 `p-2` 改为 `p-1.5`，避免长名（如 "Detective"、"Advocate"）撑出按钮边框。
- 锁定/已装备的小字行也加 `truncate`。

### 2) Quest 页【背包】面板（占位效果）
`src/pages/Quest.tsx` + `src/game/SettingsContext.tsx`
- 把现在的 "TOOL BELT" 改名为 **"BACKPACK / 背包"**，展示拥有道具+数量。
- 引入 **每副本一次 + 每次游玩仅一个** 的占位规则：
  - 在 `SettingsContext` 增加非持久 session state：`activeItem: ItemId | null`、`usedItemsByCase: Record<slug, ItemId>`、`setActiveItemForCase(slug, id)`、`getActiveItemForCase(slug)`。
  - Quest 页的副本卡片新增 "USE ITEM" 子按钮（或直接在背包格点击后选择 chapter）：方案采用——点击背包道具后弹出 chapter 选择条；选定后扣减 1 个 + 记录到 `usedItemsByCase[slug]`，并 `toast("已使用 / USED")`。
  - 进入已绑定该副本的 chapter 时，按钮显示 `🎒 ITEM ARMED`（仅占位，不接效果逻辑）。
- 后续效果接入留 TODO 注释。

### 3–7) Store 重构
`src/pages/Store.tsx`
- **删除** `robe`、`scales`、`time extension` 三个商品（包含顶部 Featured Time Extension 块）。
- **新增 / 替换** items 数组：
  ```
  gavel  → "STAR +1"          ⭐ 50  desc: "Earn one extra ★ in next chapter"
  book   → "LAW BOOK"         📕 120 desc: "Removes one wrong option in next chapter"
  badge  → "BADGE"            🛡 200 desc: "Improves defense score" (保留)
  scroll → "SCROLL"           📜 80  desc: "Unlocks hidden hints" (保留)
  xp50   → "XP BOOST +50%"    ⚖ 350 desc: "Next chapter XP +50% (rounded)"
  xp100  → "XP BOOST +100%"   👘 500 desc: "Next chapter XP +100% (rounded)"
  ```
  使用相同 ItemId 复用现有 inventory，`scales`→视为 xp50，`robe`→视为 xp100（id 保留以兼容存档），仅替换显示名/描述/图标。
- 移除 `buyTimeExtension`、`timeExtensions` 在 Store UI 中的引用（context 字段保留以兼容旧存档，但新代码不暴露入口）。
- `Quest` 背包同步隐藏 `timeExt` 项（不再显示 SPECIAL TIME EXT 入口）。
- XP 加成在 `addXp` 处只留 TODO（以后再细化数值），本轮仍是占位 + toast。

### 8) 签到 star 数值 -50%
`src/components/HomeOverlays.tsx` `DailyRewardsModal` 显示文案 + `SettingsContext.claimDailyDay`：
- 当前奖励 `50 * day`，改为 `Math.round(25 * day)`（即 25/50/75/100/125/150，第7天仍为 special tool）。
- Modal 文案 `+${50 * day}` 改为 `+${Math.round(25 * day)}`。

### Out of scope
- 道具效果实际作用于游戏数值（star+1/移除选项/XP 倍率）将后续单独实现，本轮仅 UI + toast 占位。
- 不动 i18n（只有英文）。

### Files
- `src/components/AvatarPickerModal.tsx`
- `src/components/HomeOverlays.tsx`
- `src/game/SettingsContext.tsx`
- `src/pages/Quest.tsx`
- `src/pages/Store.tsx`
