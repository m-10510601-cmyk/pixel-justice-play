## 章节完成奖励 ⭐ 系统（支持「分数提升」补差）

每章通关时根据表现发放星星（即 store 通用 ⭐）。**重玩同一章如果得到更高分数，会补发差额**；分数不变或更低则不发。

### 奖励公式
- **Ending 基础分**
  - 🟢 Rational / Best ending → 3 ⭐
  - 🟡 Realistic ending → 2 ⭐
  - 🔴 Bad ending → 1 ⭐
- **决策加分**：每一题选中 `best: true` 选项 +1 ⭐
- **完美通关奖励**：所有 choice 都选最佳 → 额外 +2 ⭐

### 持久化（关键：记录历史最高分）
新建 `src/lib/rewards.ts`：
- `localStorage` key: `lawguardian.rewards.v1` → `{ [slug]: highestStars }`
- `claimChapterReward(slug, stars, addCoins)`：
  - `prev = stored[slug] ?? 0`
  - 若 `stars > prev`：`addCoins(stars - prev)`，写入 `stored[slug] = stars`，返回 `{ delta, total: stars, isImprovement: true, firstTime: prev === 0 }`
  - 否则：返回 `{ delta: 0, total: prev, isImprovement: false }`
- `computeStars(STORY, answers, ending)`：遍历章节 STORY 数组，统计 best 数 + ending 基础 + 完美奖励

### 9 个章节文件改动
在每个 chapter 的 done 分支：
1. `useEffect` 触发一次 `claimChapterReward`，把结果存入本地 state（`reward`）
2. 完成屏新增奖励卡片：
   - ✨ 首次通关：`Stars earned: ⭐ X`
   - 📈 重玩提升：`New best! +X ⭐ (was Y, now Z)`
   - 🔁 未提升：`Best so far: ⭐ Y · Beat it for more stars!`
3. 显示明细：🟢/🟡/🔴 ⭐ 基础 + ✅ 最佳决策 ×N + 🏆 完美奖励（若适用）

涉及文件：所有 9 个 `src/pages/story/*.tsx` + 新建 `src/lib/rewards.ts`。Store 余额自动反映新增。