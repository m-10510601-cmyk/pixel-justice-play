## 在 chapter 内部支持「返回上一页」

目前每个章节左上角的 `←` 按钮直接跳回 `/quest`，无法回看上一段剧情/选择。

**改动思路**（应用到全部 9 个 story 页面）：
- 把 `←` 按钮从单纯的 `<Link to="/quest">` 改为智能按钮：
  - 若 `i > 0`：点击执行 `setI(i - 1)`（同时清掉 `revealedAt`/`quiz` 等当前步状态），回到上一 step。
  - 若 `i === 0`：点击 `navigate("/quest")`，回到案件列表。
- 在按钮右侧再加一个固定的「🏠 案件」小按钮，始终可回 `/quest`，方便用户随时退出。
- `aria-label` 根据状态动态显示 `Back` / `Cases`。

**涉及文件**（同样的 header 结构）：
- `src/pages/story/SilentFall.tsx`
- `src/pages/story/GreenTrade.tsx`
- `src/pages/story/SilentDormitory.tsx`
- `src/pages/story/TheRunner.tsx`
- `src/pages/story/SilentRoom.tsx`
- `src/pages/story/MaskOfAuthority.tsx`
- `src/pages/story/RitualOfPower.tsx`
- `src/pages/story/HighPayTrap.tsx`
- `src/pages/story/DarkNight.tsx`

不改业务逻辑（不动 progress / answers 持久化）。