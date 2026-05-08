## 优化星星动画与 XP 结算面板

### 1. 星星粒子数 = 实际获得星数

`StarBurst` 当前用 `count*4`（最多 24 颗）。改为粒子数严格等于本次获得星数 `breakdown.total`：

- 1 颗时仍只飞 1 颗星，配合中央大星已足够明显。
- 大星依旧弹出（视为「主奖杯」，不计入散射数）。
- 粒子分布角度按等分圆周（`(i/n)*2π + 小随机抖动`），无论是 1 颗还是 7 颗都好看。
- 粒子尺寸略放大（28–44px），数量少时单颗更突出。

### 2. 结算面板加 XP 动画与等级条

在 `StarReward` 内的「+XP」一行下方新增一个 XP 结算块：

- 显示当前等级名 + LV 数字。
- 一条 XP 进度条，从「结算前 XP」开始动画填充到「结算后 XP」（≈ 1.2s 缓动）。
- 若本次直接打满本等级（触发 pendingQuiz），进度条满格闪烁，并显示提示文案 `quiz.ready`「★ 升级测验已就绪 — 回主页应战！」。
- XP 数字也用 tween 从旧值滚动到新值。

实现要点：
- 在 `StarReward` 调用 `addXp` 之前，先快照 `level`、`xp`、`xpToNext`，作为动画起点。
- 新增局部 hook 用 `requestAnimationFrame` 做线性插值；或简化为 CSS transition + state 触发宽度变化。
- 升级跨级情况（XP 溢出）罕见，简化为：进度条动画到 100%，再短暂停顿后归零并继续到溢出值；超出本计划范围则只动画到 100%。

新增翻译键（en/zh/ms）：
- `reward.xpGained`：「Experience gained / 获得经验 / EXP Diperoleh」
- `reward.levelProgress`：「Level Progress / 等级进度 / Kemajuan Tahap」
- `quiz.ready`：「★ Level-up quiz unlocked — return home!」/「★ 升级测验已就绪 — 回主页应战！」/「★ Kuiz naik tahap dibuka — pulang!」

### 文件变更

- `src/components/story/StarBurst.tsx`：粒子数公式 `Math.max(1, count)`，去掉 ×4 与 24 上限；调整尺寸/分布。
- `src/components/story/StarReward.tsx`：插入 XP 进度条 UI + 动画逻辑，从快照值过渡到当前值。
- `src/game/SettingsContext.tsx`：补 3 条翻译键。

### 不在范围

- 不改星星 / XP 数值规则
- 不改首页等级显示
- 不重写 quiz 模态