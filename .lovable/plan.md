## 优化 Brightness 系统

把当前的「3档按钮（默认/亮/暗）」升级为「连续滑块 + 自动跟随系统」，并把亮度真正应用到画面、场景图和UI上。

### 1. 数据模型（SettingsContext）
- 新增 `brightness: number`（0–200，100=正常，<100变暗，>100变亮），默认 `100`，持久化到 `localStorage`。
- 新增 `brightnessAuto: boolean`，默认 `false`。开启时监听 `prefers-color-scheme`：dark → brightness=70，light → brightness=115。
- 保留 `theme` 字段以兼容旧存档（读取时把 `light→115 / dark→70 / default→100` 迁移到 brightness，迁移后丢弃）。
- 导出：`brightness`, `setBrightness`, `brightnessAuto`, `setBrightnessAuto`。

### 2. 应用方式
在 `<html>` 上设置 CSS 变量 `--brightness: <value/100>`，由一个 effect 写入：
```text
root.style.setProperty('--brightness', String(brightness / 100));
```

`src/index.css` 改造 `.brightness-overlay`：
- 不再依赖 `theme-light/theme-dark` 类。
- 用单层 overlay：`brightness < 100` 时显示半透明深色（不透明度 = `(100-brightness)/100 * 0.6`），`brightness > 100` 时显示半透明暖白（不透明度 = `(brightness-100)/100 * 0.35`），平滑过渡 200ms。

场景背景图与UI（`.game-frame`）加一个 CSS filter：
```text
.game-frame { filter: brightness(var(--brightness, 1)); }
```
这样背景图和UI（按钮/文字）一起跟着变，避免太暗看不清按钮文字（filter同时作用）。overlay 提供色温感，filter 提供真正的明暗。

### 3. Settings 页面 UI
替换 `Row "BRIGHTNESS"` 区域：
- 一行：`☾` 图标 + `<Slider min=40 max=160 step=5>` + `☀` 图标 + 百分比显示（如 `100%`）。
- 下方一行：`AUTO` toggle 按钮（pixel-btn 样式），开启后滑块禁用并显示当前自动值。
- 使用项目已有的 `@/components/ui/slider`，外加 pixel 风格 wrapper 保持像素风。
- 复用 `playCue()` 在滑动结束/toggle时给反馈。

### 4. 文案（DICT）
- `settings.brightness.auto` = "AUTO"
- `settings.brightness.manual` = "MANUAL"

### 5. 文件改动清单
- `src/game/SettingsContext.tsx` — 加 brightness/brightnessAuto 状态、持久化、迁移、`prefers-color-scheme` 监听、CSS 变量写入。
- `src/index.css` — 重写 `.brightness-overlay` 用 CSS 变量驱动；给 `.game-frame` 加 `filter: brightness(var(--brightness))`。
- `src/pages/Settings.tsx` — 替换按钮为滑块 + AUTO toggle。
- 兼容旧 theme 字段：读时迁移，写时不再写 `theme`。

### 验证
- 滑块拉到最左 → 画面明显变暗（overlay+filter），按钮文字仍可读。
- 拉到最右 → 画面变亮但不过曝。
- AUTO 开启 → 滑块灰显，切换系统主题（Chrome devtools 模拟）→ 亮度立即跟随。
- 刷新页面 → 亮度持久化。
- 旧用户原 theme=dark → 自动迁移为 brightness=70。
