## 美化头像系统 — 保留像素 + 更华丽金框

覆盖范围：HUD 小徽章、弹窗大头像展示框、Picker 列表格子、像素角色本身。统一一套"皇家金边相框"视觉语言。

### 1. 新增共享样式 (`src/index.css`)
- `.avatar-royal`：通用相框容器
  - 外圈 1px 暗金阴影 + 双层金边 (inset)：浅金 `hsl(48 95% 65%)` 与深金 `hsl(36 85% 42%)` 之间夹一道暗色 `hsl(30 50% 8%)`，形成"金属浮雕"层。
  - 内侧四角加微高光（伪元素 `::before` 渐变），模拟金属反光。
  - 背景使用径向渐变 `radial-gradient(circle at 30% 25%, hsl(40 30% 22%), hsl(28 35% 12%))` 给像素角色一个"棚拍"光环。
- `.avatar-royal--equipped`：装备态——金色脉冲光晕 `box-shadow: 0 0 0 1px gold, 0 0 16px hsl(var(--gold)/0.55)` + 缓慢 `@keyframes avatarGlow`。
- `.avatar-royal--locked`：锁定态——灰阶 + 暗紫罩。
- `.avatar-rivet`：复用现有 `gb-rivet` 思路，但更小、带渐变高光，四角统一。
- `.avatar-level-chip`：右下等级章——金底黑字、菱形切角 (`clip-path: polygon(...)`) 或圆形带描边，更像"勋章"而非方块标签。
- `.avatar-rarity-ring`：根据 `unlockLevel` 映射稀有度色：1=银、2-3=蓝、4=紫、5=金。在外圈再叠一道 1px 稀有度色描边。

### 2. 像素角色本身微调 (`src/lib/avatars.tsx`)
- `Frame` 组件升级：
  - 加柔和肩部阴影（底部 2px 渐变）让脸"立起来"。
  - 高光从纯白改成 `hsl(45 90% 88% / 0.25)`，更暖。
  - 边框从 `solid black` 改为 `solid hsl(28 40% 12%)`，配合金框更协调。
- 为每个角色加一个"环境光斑"：`Frame` 接受 `accent` 颜色，在右上角贴一个 2px 高光像素。
- `shadow` 角色：眼睛红光改成 `text-shadow` 风格的发光像素（额外一层半透明叠色）。
- `guardian` 皇冠：中央加一颗 1px 红宝石像素。

### 3. HUD 小徽章 (`src/components/AvatarBadge.tsx`)
- 容器换成 `.avatar-royal` + 稀有度环 class。
- 四角 rivet 改成 `.avatar-rivet`，带渐变。
- 等级章改成 `.avatar-level-chip`（菱形勋章），字体保持 Press Start 2P。
- 加 `title={avatar.name}` 提升可达性。

### 4. 弹窗大头像 (`src/components/AvatarDetailsModal.tsx`)
- 当前 `avatarWrapRef` 的内联 boxShadow 删除，替换成 `.avatar-royal avatar-royal--equipped` + 稀有度环 class。
- 在大头像外圈再叠一圈薄薄的"光晕"动画（slow rotate gradient ring，CSS only）。
- 角色名下面加一行小小的稀有度图标条（4 颗像素方块按稀有度填色）。

### 5. Picker 列表格子 (`src/components/AvatarPickerModal.tsx`)
- 每个 `<button>` 内的头像容器套 `.avatar-royal`（小号变体 `.avatar-royal--sm`，padding/边框等比缩小）。
- 装备态 ring 改用 `.avatar-royal--equipped` 金色脉冲，移除原 `ring-2 ring-accent`。
- 锁定态加 `.avatar-royal--locked` + 一把像素小锁图标覆在中央。
- 卡片底色统一为深褐色木板感（`background: hsl(28 25% 14%)`），让金框更跳。

### 6. 不改动
- `SettingsContext`、头像数据 id/解锁等级、业务逻辑。
- 字体、布局、其余页面。

### 文件清单
- `src/index.css`（新增样式 + keyframes）
- `src/lib/avatars.tsx`（Frame 微调 + 局部细节）
- `src/components/AvatarBadge.tsx`（套用新样式）
- `src/components/AvatarDetailsModal.tsx`（大框 + 稀有度条）
- `src/components/AvatarPickerModal.tsx`（格子升级 + 锁图标）

### 视觉一致性原则
所有四处使用同一套金框 token，仅尺寸/状态变体不同，确保 HUD ↔ Picker ↔ 弹窗看起来是同一件"勋章"在不同放大率下的呈现。
