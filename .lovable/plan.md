## 问题
Quest 页面里只有**已锁定**的章节卡显示星星进度（`X★ / Y★`），章节 1、2 因为是已解锁状态，只显示「继续 %」进度条，看不到自己的星星收集情况。

## 方案
为**所有已解锁的章节卡**也加上星星进度显示，与锁定卡保持视觉一致：
- 显示 `bestStars ★ / maxStars ★`
- 配一条小进度条（按 `bestStars / maxStars` 比例）
- 未通关时显示 `0 ★ / max ★`，鼓励玩家去刷
- 满星时整行高亮成强调色 + ✨

## 改动
仅修改 `src/pages/Quest.tsx`：
1. 在已解锁卡片渲染分支，从 `getChapterBest(c.slug)` + `computeMaxStars(c.story)` 取数据。
2. 在「CONTINUE %」进度条上方/下方加一个星星进度条（与锁定卡布局对齐）。
3. 满星 (`have === max`) 时给星星数字加 `text-accent` 与 ✨ 图标。

不改业务逻辑、不动其它文件。
