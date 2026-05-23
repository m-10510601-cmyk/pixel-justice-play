## 目标
优化头像视觉设计，并支持点击头像查看「头像详情」（而非直接进入选择器）。

## 改动范围
仅前端展示层，保持现有配色（紫 `#1a1625` / 金 `#fbbf24`）和像素风格。

### 1. AvatarBadge 视觉升级（`src/components/AvatarBadge.tsx`）
- 加金色像素描边 + 内层暗紫底，形成"勋章框"质感
- 四角加小金色铆钉（`rivet`）
- 等级小角标：右下角圆形金底显示当前 `Lv N`（从 `useSettings` 取 `level`）
- hover：轻微上浮 + 金色外发光；active：按下位移 1px
- 解锁新头像时（可选）顶部加一颗闪烁星标

### 2. 新建 AvatarDetailsModal（`src/components/AvatarDetailsModal.tsx`）
点击头像后默认打开此弹窗（替代当前直接打开 Picker）：
- 顶部：放大版当前头像（96px）+ 名称 + 当前等级
- 中部：解锁条件、稀有度（按 `unlockLevel` 推导：1=普通 / 2-3=稀有 / 4=史诗 / 5=传说，金色字）
- 角色背景小段描述（每个 avatar 一句 flavor text，新增到 `src/lib/avatars.tsx` 的 `AvatarDef.bio`）
- 已解锁头像数 / 总数进度条
- 底部双按钮：
  - 「更换头像」→ 关闭详情，打开现有 `AvatarPickerModal`
  - 「关闭」

### 3. AvatarPickerModal 小优化（`src/components/AvatarPickerModal.tsx`）
- 选中头像时点击右下「查看详情」可回到 Details
- 卡片 hover 加金色边框过渡（仅样式微调）

### 4. 接入 Index 页（`src/pages/Index.tsx`）
- 新增 `openAvatarDetails` 状态
- HUD 头像 onClick 改为打开 Details，而非 Picker
- 渲染 `<AvatarDetailsModal>`，并传入打开 Picker 的回调

## 技术细节
- 不改业务逻辑、不改 Settings/存档
- 所有颜色走 `index.css` 已有 token（`--accent` 金、`--primary` 紫）
- bio 文案中英双语：在 `avatars.tsx` 中各 avatar 增加 `bio: { en, zh }`，通过 `useSettings().lang` 选择
- 等级角标用绝对定位的小方块，不影响现有 `Frame` 渲染

## 不做
- 不改其他页面头像出现位置（`AvatarBadge` 升级后自动生效）
- 不引入新依赖
