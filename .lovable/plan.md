## Goal
让玩家可以从多个像素头像中选择一个作为 HUD 显示的头像，按等级解锁。点击主页 HUD 左上角头像即可打开选择器。

## 头像目录（8 款，混合像素小人 + 职业角色）

| # | ID | 风格 | 解锁等级 |
|---|----|------|----------|
| 1 | rookie | 默认像素小人（当前 AvatarBadge） | Lv 1 |
| 2 | scholar | 学生（眼镜 + 校服色） | Lv 1 |
| 3 | officer | 警察（蓝帽 + 徽章像素） | Lv 2 |
| 4 | advocate | 律师（黑袍 + 白领） | Lv 3 |
| 5 | detective | 侦探（风衣 + 帽檐） | Lv 3 |
| 6 | judge | 法官（白假发 + 黑袍） | Lv 4 |
| 7 | guardian | 守护者（金冠像素小人） | Lv 5 |
| 8 | shadow | 神秘人（兜帽剪影） | Lv 5 |

全部用纯 CSS/div 像素绘制（与现有 `AvatarBadge` 同风格），不引入图片资源。

## 改动

### 1. 新建 `src/lib/avatars.ts`
- 定义 `AvatarId` 联合类型与 `AVATARS: { id, name, unlockLevel, render(size) }` 列表。
- `render` 返回 JSX，参数化 `size`（HUD 用 28，选择器卡片用 56）。
- localStorage key: `lawguardian.avatar.v1`，存当前选中的 id（默认 `rookie`）。
- 导出 `loadAvatar()` / `saveAvatar(id)` / `isAvatarUnlocked(id, level)`。

### 2. `src/game/SettingsContext.tsx`
- 新增 state：`avatarId`、`setAvatar(id)`，初始读 `loadAvatar()`，变更时写 localStorage。
- 通过 context 暴露给 HUD / 选择器。

### 3. 重写 `src/components/AvatarBadge.tsx`
- 从 settings 读取当前 `avatarId`，调用对应 `render(28)`。
- 接收可选 `onClick` prop；当传入时加 `cursor-pointer` + hover 高亮 + 键盘可达（`role="button"`、`tabIndex=0`、Enter/Space 触发）。

### 4. 新建 `src/components/AvatarPickerModal.tsx`
- 使用现有 GameFrame 风格（pixel-btn + 黑边）。
- 网格 4 列，列出全部头像；每张卡片显示像素预览 + 名称 + 解锁状态。
- 当前选中 → 高亮边框 + "✓ EQUIPPED"。
- 已解锁未选 → 点击切换。
- 未解锁 → 灰阶 + 🔒 + "Lv X 解锁" 文案，不可点击。
- 顶部显示当前等级，方便对照。

### 5. `src/pages/Index.tsx`
- 引入 `useState` 控制 modal 打开。
- 给 `<AvatarBadge>` 加 `onClick={() => setOpen(true)}`，渲染 `<AvatarPickerModal open onClose />`。

## 文案（en/zh/ms）
- `avatar.title` = CHOOSE AVATAR / 选择头像 / PILIH AVATAR
- `avatar.equipped` = EQUIPPED / 已装备 / DIPAKAI
- `avatar.locked` = Reach Lv {n} to unlock / 升至 Lv {n} 解锁 / Capai Lv {n}
- 加入 `SettingsContext` 的 DICT 中。

## 注意
- 全部纯前端 + localStorage，无后端改动。
- 不破坏现有 HUD 布局；尺寸保持 28×28。
- 头像渲染统一在 `avatars.ts`，方便后续新增。
