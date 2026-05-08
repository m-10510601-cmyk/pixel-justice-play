## 经验值与等级系统

完成章节获得经验值，累计升级；升级前需通过 5 题法律 mini quiz（答对 ≥3 题），否则当前等级经验清零，等级保留。

### 等级与经验阈值

| 等级 | 名称 | 升下一级所需 XP |
|---|---|---|
| 1 | LAW APPRENTICE | 50 |
| 2 | STUDENT INVESTIGATOR | 120 |
| 3 | JUNIOR JUDGE | 220 |
| 4 | COURT SPECIALIST | 360 |
| 5 | CHIEF JUSTICE | — (满级) |

### XP 来源

完成一章 = 当次获得的 ⭐ 星数 × 10 XP（无论是否首通；可重复刷）。复用 `StarReward` 已计算的 `breakdown.total`，避免再造一套数值。

### 升级流程

1. XP 累计 ≥ 当前等级阈值时，触发 Mini Quiz 模态（在玩家下次回到首页或完成章节结算后弹出）。
2. 5 题单选，依等级难度递增：
   - L1→L2：基础常识（合法/违法判断）
   - L2→L3：校园/社会案例适用条款
   - L3→L4：举证标准、刑责构成
   - L4→L5：复杂判例、量刑边界
3. 计分：答对 ≥3 → 升级，溢出 XP 保留到新等级。
4. 答对 <3 → 等级保留，**当前等级累计 XP 清零**，可重新刷章再次挑战。

### 实现要点（技术细节）

新增文件：
- `src/lib/levels.ts`：等级定义、阈值数组、`addXp(amount)`、`getLevelInfo()`、`resetCurrentXp()`，localStorage key `lawguardian.level.v1`，结构 `{ level: 1-5, xp: number, pendingQuiz: boolean }`。
- `src/data/levelQuiz.ts`：4 套题库（L1→L2 … L4→L5），每套至少 8 题，弹出时随机抽 5。题目结构 `{ q, options[4], answerIdx, explain }`。三语版本（en/zh/ms），与现有 i18n 风格一致。
- `src/components/LevelUpQuizModal.tsx`：5 题答题流程 → 结算面板（X/5、通过/失败、说明），确定后调用 `levels` API 升级或清零。
- `src/components/LevelBadge.tsx`：替换首页 HUD 中硬编码的 `LV 1`，显示当前等级编号 + 等级名 + XP 进度条。

修改文件：
- `src/game/SettingsContext.tsx`：暴露 `level`、`xp`、`addXp`、`levelName`、`xpToNext`、`pendingQuiz`、`resolveQuiz(passed)`。同步持久化。
- `src/components/story/StarReward.tsx`：`useEffect` 内除 `claimChapterReward` 外，额外 `addXp(stars * 10)` 并显示一行「+XP」。
- `src/pages/Index.tsx`：HUD 改用 `LevelBadge`；若 `pendingQuiz` 为 true，挂载 `<LevelUpQuizModal>` 自动打开。
- 三语字典补充 `level.*`、`quiz.*` 文案。

### 不在范围

- 不改星星 / 金币系统
- 不改章节剧情、选项判定
- 满级（CHIEF JUSTICE）后不再累 XP，不再触发 quiz