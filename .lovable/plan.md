## 等级详情：XP 来源细分 + 实时一致

### 1. 记录 XP 来源

把累计获得的 XP 拆为三个来源并持久化：

- `chapter`：章节首通带来的 XP
- `replay`：重玩同章带来的 XP
- `quiz`：通过升级测验获得的奖励 XP（**新增**：每通过一次升级测验 +20 XP，让"测验"成为真实来源；溢出会按现有 `applyXp` 规则结算）

新增 `src/lib/levels.ts`：
- 类型 `XpSource = "chapter" | "replay" | "quiz"`
- localStorage key `lawguardian.xpsources.v1`，结构 `{ chapter: number, replay: number, quiz: number }`
- 工具 `loadXpSources()` / `addXpSource(src, amount)` / `getXpSources()`，纯函数 + 单 effect 持久化

`src/game/SettingsContext.tsx`：
- `addXp(n, source?: XpSource)`：默认 `"chapter"`；同时累加到对应来源
- 暴露 `xpSources: { chapter, replay, quiz }` 给 UI
- `resolveQuiz(passed)`：`passed` 时调用 `addXp(20, "quiz")`

`src/components/story/StarReward.tsx`：
- claim 时根据 `result.firstTime` 决定 source：`firstTime ? "chapter" : "replay"`
- 调用 `addXp(xpGain, source)`

### 2. 详情弹窗增加"XP 来源"卡片

在「Promotion Path」与「How to earn XP」之间插入：

```
⚡ XP SOURCES (累计)
🎬 Chapters first clear   1230 XP
🔁 Replays                  340 XP
⚖ Quiz bonus                40 XP
─────────────────────────
TOTAL                     1610 XP
```

每行显示图标 + 名称 + 数值；下方一行细横条按比例可视化三段（chapter/replay/quiz 的颜色块）。

### 3. 距下一级 & 百分比 — 实时一致

确保 `LevelDetailsModal` 内 `pct`、`remaining`、`xp/xpToNext` 全部由同一份 `useSettings()` 派生，不缓存任何快照。当前实现已派生但分散在两处计算（`pct = xp/xpToNext`，`remaining = xpToNext - xp`），改成显式计算块并用 `useMemo` 集中，避免未来误改一边导致不同步：

```ts
const { progress, remaining, pct } = useMemo(() => {
  const need = xpToNext || 0;
  const cap = Math.min(xp, need);
  return {
    progress: cap,
    remaining: Math.max(0, need - cap),
    pct: need ? Math.round((cap / need) * 100) : 100,
  };
}, [xp, xpToNext]);
```

并在底部显示 `{pct}%` 数字，与进度条 width 同源；进度条加 `transition-all duration-300` 让数值变化平滑。`SettingsProvider` 的 `xp` state 一更新，弹窗内所有派生值（含 XP 来源）立即重渲染——天然实时。

### 4. 翻译键（en / zh / ms）

- `level.sources.title`「XP SOURCES / XP 来源 / SUMBER EXP」
- `level.sources.chapter`「First clear / 首次通关 / Tamat Pertama」
- `level.sources.replay`「Replay / 重玩 / Main Semula」
- `level.sources.quiz`「Quiz bonus / 测验奖励 / Bonus Kuiz」
- `level.sources.total`「Total / 累计 / Jumlah」

### 文件变更

- `src/lib/levels.ts`：新增 source 类型 + 持久化函数
- `src/game/SettingsContext.tsx`：扩展 `addXp(n, source)`、暴露 `xpSources`、`resolveQuiz` 加 quiz 奖励、补 5 条翻译
- `src/components/story/StarReward.tsx`：传 source 参数
- `src/components/LevelDetailsModal.tsx`：新增 XP 来源卡片 + useMemo 统一派生 + 显示 `{pct}%`

### 不在范围

- 不改 5 级名称 / 阈值
- 不改 quiz 题库与通过规则（仍 ≥3）
- 不为旧存档回填来源（旧总 XP 视为 chapter，零除问题已规避）