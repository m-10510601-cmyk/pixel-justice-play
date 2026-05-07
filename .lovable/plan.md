## 计划：根据场景添加循环背景音乐

### 1. 音乐素材（免费、可商用、Pixabay Music CC0）
下载到 `public/music/`（公共目录直接 URL 引用，便于 `<audio>` 流式加载）：

| 文件 | 用途 | 风格 |
|---|---|---|
| `menu.mp3` | 主菜单 (Index) | 温暖庄严、像素游戏主题 |
| `quest.mp3` | Quest 案件列表 | 悬疑探案、轻节奏 |
| `courtroom.mp3` | Case 法庭页（Brief/Evidence/Legal/Verdict） | 严肃管弦/法庭氛围 |
| `story-tense.mp3` | Silent Fall / Silent Dormitory / Dark Night | 紧张悬疑 |
| `story-mystery.mp3` | Green Trade / Mask of Authority / The Runner | 神秘潜行 |
| `story-somber.mp3` | Silent Room / Ritual of Power / High-Pay Trap | 悲伤压抑 |

> 由 AI 在构建时用 `curl` 从 Pixabay CDN 拉取（已知公开 mp3 URL）。若某个链接失效则换备用。文件均为 CC0 / Pixabay Content License，可商用、无需署名。

### 2. 全局 BGM 管理
- 在 `SettingsContext` 中新增：
  - `bgmEnabled: boolean`（默认 `true`，持久化到 localStorage）
  - `setBgmEnabled(b)`
- 新建 `src/game/BgmController.tsx`：
  - 维护单个 `HTMLAudioElement`，`loop = true`
  - 监听路由变化（`useLocation`），按规则映射当前 `pathname → trackUrl`
  - 切歌时做 ~400ms 淡入/淡出（`requestAnimationFrame` 调 `audio.volume`）
  - 音量 = `volume / 100 * 0.5`（BGM 比 SFX 轻，避免压过音效）
  - `bgmEnabled === false` 或 `volume === 0` 时暂停
  - 浏览器自动播放策略：首次 `audio.play()` 失败时，挂一个一次性 `pointerdown/keydown` 监听，等首次交互后再 play（用户已答"自动播放 + 设置开关"，这是标准兜底，不增加按钮）
- 在 `App.tsx` 的 `<SettingsProvider>` 内、`<BrowserRouter>` 内挂 `<BgmController />`

### 3. 路由 → 曲目映射
```
/                              → menu.mp3
/quest                         → quest.mp3
/triumph, /store, /settings    → menu.mp3（沿用主菜单）
/case/*                        → courtroom.mp3
/story/silent-fall             → story-tense.mp3
/story/silent-dormitory        → story-tense.mp3
/story/dark-night              → story-tense.mp3
/story/green-trade             → story-mystery.mp3
/story/mask-of-authority       → story-mystery.mp3
/story/the-runner              → story-mystery.mp3
/story/silent-room             → story-somber.mp3
/story/ritual-of-power         → story-somber.mp3
/story/high-pay-trap           → story-somber.mp3
```

### 4. Settings 页 UI
在现有"音量"行下方新增一行"背景音乐"，带一个像素风开关按钮（ON/OFF），切换 `bgmEnabled`。文案走 `t()`：
- `settings.bgm` → "Background Music" / "背景音乐"
- `settings.on` / `settings.off`

### 5. 不改动的部分
- 现有 `playCue`（WebAudio 音效蜂鸣）保留，不受影响
- 现有 `volume` 同时控制 SFX 与 BGM 音量比例
- 不引入新依赖

### 验证
- 打开 `/` 应听到 menu 音乐（首次需点一下页面，已知浏览器策略）
- 跳转 `/quest`、各 `/story/*`、`/case/*` 时音乐平滑切换
- Settings 关闭"背景音乐"后立即静音，刷新仍保持关闭