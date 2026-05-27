## 目标

玩家在 Terms Gate → Username Gate 输入名字进入主页后，应保留之前的 **章节进度 / 等级 / 金币 / 头像 / 上次游玩**。

## 现状审计

- `UsernameGate` 只调用 `setUsername(value)`，后者只写 `localStorage["lawguardian.username.v1"]`，不会触碰任何进度键。
- 进度键：`lawguardian.progress.v1.<slug>`、`lawguardian.lastPlayed.v1`、`lawguardian.level.v1`、`lawguardian.xpsources.v1`、`lawguardian.meta.v1`、`lawguardian.avatar.v1` — 全部由各自 loader 独立读取，不会被用户名流程清空。
- `autoSave.ts` 只做"快照→AUTOSAVE_KEY"，从不主动回写其它键，所以安全。

也就是说，**数据层是正确的，进度本来就在**。

潜在的可见 bug：`src/pages/Index.tsx` 在 `useEffect(..., [])` 里只在 mount 时读一次 `getLastPlayed()`。在新设备首次输入名字后立刻关闭 Gate，没问题；但如果上次因为某些路径在 username 变化时重新挂载/导航，`CONTINUE` 按钮可能短暂不出现。一并修掉。

## 改动

### 1. `src/pages/Index.tsx`
- 把 `useEffect` 依赖改为 `[username, agreedTerms]`，每当玩家完成 Gate 时重新读取 `getLastPlayed()`，保证 CONTINUE 按钮立刻反映已有进度。
- 同时在 `window` 上监听 `storage` 事件（跨标签同步），收到时也刷新 `lastPlayed`。

### 2. `src/components/UsernameGate.tsx`
- 在 `submit()` 成功后增加一层防御：**只写 username，不动其它键**（保持现状，加一行注释明确该约束，防止后续误改）。

### 3. `src/game/SettingsContext.tsx`
- 在 `setUsername` 上方加注释：禁止在此处清空/重置进度相关键。
- 不修改任何行为。

### 4. 验证步骤（手动 QA，由我在切换 build 模式后执行）
1. 打开 DevTools → Application → Local Storage，确认存在 `lawguardian.progress.v1.*` 或 `lawguardian.lastPlayed.v1` 后，清空 `lawguardian.username.v1`。
2. 刷新，Username Gate 弹出 → 输入新名字 → 确认主页：
   - 头像/等级/金币显示原值
   - "▶ CONTINUE" 按钮立即出现并指向旧的故事章节
3. 再次刷新，Gate 不再出现，状态保持。

## 不做的事

- 不引入云端账号系统（用户已选择"本地存储"）。
- 不改动任何进度/等级/金币的数据结构或迁移逻辑。
