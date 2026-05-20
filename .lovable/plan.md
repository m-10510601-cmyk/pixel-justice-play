## 目标

每日签到第 7 天（特别奖励）领取时，除了现有的 special tool（时间延长 +1），再额外随机发放一件商店道具到背包。

## 改动

文件：`src/game/SettingsContext.tsx`，函数 `claimDailyDay`（约第 455 行）

在 `day === 7` 分支里，从商店 6 件道具池中随机抽 1 件，写入 `meta.items`：

```ts
const STORE_POOL: ItemId[] = ["gavel", "book", "badge", "scroll", "scales", "robe"];
// 在 day === 7 时：
const bonusItem = STORE_POOL[Math.floor(Math.random() * STORE_POOL.length)];
// 在返回的新 meta 中：items: { ...m.items, [bonusItem]: (m.items[bonusItem] ?? 0) + 1 }
```

同时把抽到的道具 id 通过外层变量带出，便于 UI 在领取后用 toast/提示告知玩家"获得了 X"。

文件：`src/components/HomeOverlays.tsx` 的 `DailyRewardsModal`

`claimDailyDay(day)` 改为接收返回的奖励信息（或新增一个 `lastDailyBonusItem` 状态），在 day 7 领取成功后弹出一条 sonner toast，例如 `🎁 获得 LAW BOOK x1`，使用 `ITEM_META` 中的名称。

## 范围之外

- 不改商店逻辑、价格、道具效果
- 不改前 6 天的奖励规则
- 不改背包 UI

## 技术备注

- `addItem` 已存在，可在 `claimDailyDay` 之外的 UI 层捕获返回值后调用，避免重复实现 items 合并逻辑。更干净的方案：把 `claimDailyDay` 返回类型从 `boolean` 改成 `{ ok: boolean; bonusItem?: ItemId }`，UI 层据此调用 `addItem(bonusItem)` 并 toast。所有现有调用点（仅 `HomeOverlays.tsx` 一处）同步更新为读 `.ok`。
