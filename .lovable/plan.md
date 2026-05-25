## 目标
头像系统与等级系统的所有 UI 元素都放进统一的「金边像素 box」里，做到视觉一致 + 框感强。

## 1. HUD 顶部左侧（`src/pages/Index.tsx`）
当前：浅紫细条 `hud-bar-purple` 内随意排列 avatar + 🪙 + level。  
改为：把 AvatarBadge + 金币 + LevelBadge 包进一个**双层金边像素框**（暗紫底、金色描边、四角金铆钉），形成一个整体 HUD box。新增 class `.hud-box`（在 index.css）。

## 2. LevelBadge 重构（`src/components/LevelBadge.tsx`）
对齐 AvatarBadge 的金框风格：
- 外层：金色像素双描边 + 暗背景 + 四角金铆钉
- 内部：LV 数字（大金字）+ 名称 + XP 进度条 + XP 文本
- hover：上浮 + 金色发光（复用 `.avatar-badge-frame` 同款 hover 或新建 `.pixel-frame` 通用类）

## 3. 提取通用 `.pixel-frame` 样式（`src/index.css`）
把 AvatarBadge 内联的金边 + 铆钉样式抽到 CSS 类 `.pixel-frame`（变量化 padding），AvatarBadge / LevelBadge / HUD box 三处复用，保持统一。

## 4. AvatarDetailsModal & LevelDetailsModal 内部 box 化
- AvatarDetailsModal：头像区已在金框内；给 BIO 区、COLLECTION 区显式加 `.pixel-frame` 风格的子 box（金边+暗底），让"信息分块"更清晰。
- LevelDetailsModal：当前 status / sources / path 三段已用 border 区分，但样式不一致。统一改成 `.pixel-frame` 风格小 box（金描边 + 暗紫底 + 标题贴在框顶）。

## 5. 不动
- 业务逻辑、存档、SettingsContext、路由
- 颜色仍走现有 token（`--gold` / `--background` / `--accent`）
- 不引入新依赖

## 技术细节
- `.pixel-frame { position: relative; background: hsl(var(--background)); box-shadow: inset 0 0 0 2px hsl(var(--gold)), inset 0 0 0 4px hsl(30 50% 8%), 0 0 0 1px hsl(30 50% 8%); }` + `.pixel-frame > .rivet` 四角小金块
- HUD box 横向 flex，间距 8px，圆角 0
- LevelBadge 仍是 `<button>`，外层套 `.pixel-frame`
- AvatarBadge 改为复用 `.pixel-frame` 类（去掉内联 boxShadow），保持等级角标不动
