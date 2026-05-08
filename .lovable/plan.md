## 等级详情面板

让首页 HUD 上的 `LevelBadge` 变成可点击按钮，点击后弹出 `LevelDetailsModal` 展示完整等级信息。

### 弹窗内容

1. **当前状态卡**
   - LV 数字 + 等级徽章名称（突出显示）
   - XP 进度条（与 HUD 同色），数值 `xp / xpToNext`
   - 距离下一级还差 `xpToNext - xp` XP
   - 若 `pendingQuiz=true`：醒目按钮「⚖ 立即挑战升级测验」（关闭详情，触发 quiz 模态——quiz 模态本身就是 pendingQuiz 驱动的，因此只需关闭详情即可看到）

2. **升级路线图（5 个等级阶梯）**
   依次列出 1–5 级，每行显示：
   - 等级图标（🎓 / 🔍 / ⚖ / 🏛 / 👑）+ LV n + 名称
   - 升至下一级所需 XP（最后一级显示 MAX）
   - 状态徽章：✓ 已达成 / ◉ 当前 / 🔒 未解锁
   - 当前等级行高亮

3. **如何获得 XP**
   一段简短说明：「完成任意章节按本次获得 ⭐ × 10 计入经验值，可重复刷取」 + 「升级前需通过 5 题法律 mini quiz（答对 ≥3）」+ 「失败保留等级、当前 XP 清零」。

### 文件变更

- 新增 `src/components/LevelDetailsModal.tsx`：使用现有 `Modal` 组件；props `{ open, onClose }`；内部 `useSettings()` 取 `level / levelName / xp / xpToNext / pendingQuiz`，搭配 `LEVEL_NAMES` 与 `XP_THRESHOLDS`（从 `@/lib/levels` 导入）渲染阶梯。
- 修改 `src/components/LevelBadge.tsx`：包一层 `<button>`，点击调用本地 `onOpen`。把 `LevelBadge` 的 props 扩展为可选 `onClick`，让父组件控制弹窗 state。
- 修改 `src/pages/Index.tsx`：新增 `openLevel` state；`<LevelBadge onClick={() => setOpenLevel(true)} />`；挂载 `<LevelDetailsModal open={openLevel} onClose={...} />`。
- `SettingsContext.tsx` 翻译键补充（en / zh / ms）：
  - `level.details.title`「LEVEL DETAILS / 等级详情 / BUTIRAN TAHAP」
  - `level.next`「Next Level / 下一级 / Tahap Seterusnya」
  - `level.toNext`「XP to next level / 距下一级 / EXP ke tahap seterusnya」
  - `level.path`「Promotion Path / 晋升路线 / Laluan Naik Pangkat」
  - `level.howToEarn`「How to earn XP / 如何获得经验 / Cara dapat EXP」
  - `level.howBody`「Complete chapters: each ⭐ earned = 10 XP. Replays count too. Pass the 5-question quiz at each tier to level up.」(对应 zh / ms)
  - `level.challengeNow`「Challenge Quiz Now / 立即挑战测验 / Cabar Kuiz Sekarang」
  - `level.statusCurrent`「Current / 当前 / Semasa」
  - `level.statusDone`「Achieved / 已达成 / Dicapai」
  - `level.statusLocked`「Locked / 未解锁 / Terkunci」
  - `level.maxed`「MAX LEVEL」

### 不在范围

- 不改 XP 公式 / quiz 内容
- 不改 Quiz 模态本身（pendingQuiz 已自动触发）