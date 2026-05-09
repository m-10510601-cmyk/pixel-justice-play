## 目标
调整背景音乐路由，让主页更具"正义感"，Quest 与所有章节页面更"悬疑"。

## 现状
`src/game/BgmController.tsx` 当前映射：
- `/` → `menu.mp3`（偏轻柔菜单感）
- `/quest` → `quest.mp3`（明亮任务感，不够悬疑）
- `/story/*` → `tense / mystery / somber` 三选一
- `/case/*` → `courtroom.mp3`（庄严、正义感强）

`public/music/` 已有：courtroom / menu / quest / story-mystery / story-tense / story-somber。无需新增音频文件。

## 方案
仅修改 `src/game/BgmController.tsx` 的路由映射，复用现有音轨：

1. **主页 `/` → `courtroom.mp3`**
   　复用现有最具"庄严正义感"的音轨作为首页 BGM。

2. **Quest `/quest` → `story-mystery.mp3`**
   　从轻快任务曲改为悬疑曲，营造"案件即将开始"的氛围。

3. **章节 `/story/*` → 统一改用悬疑系**
   　将原先按章节分配 tense/mystery/somber 的逻辑收敛为：
   - 默认 `story-mystery.mp3`
   - 仍按目前的章节分组保留细微差别（tense=紧张型章节，somber=沉重型章节），三种风格本身都属悬疑范畴，符合需求；只把原本"明亮"的 quest 曲移除即可。
   - 也提供一个更简单的备选：所有 `/story/*` 全部使用 `story-mystery.mp3`（统一悬疑）。

4. 其他路由（`/case/*`、`/settings`、`/store` 等）保持不变。

## 待确认（一个小选择）
章节页面是否：
- (A) 保留 tense / mystery / somber 三种悬疑细分（推荐，氛围更丰富）
- (B) 全部统一为 `story-mystery.mp3`（最一致的"悬疑感"）

如未指定，将采用 (A)。

## 涉及文件
- `src/game/BgmController.tsx`（仅修改 `trackForPath` 函数）

无需新增资源，无后端改动。