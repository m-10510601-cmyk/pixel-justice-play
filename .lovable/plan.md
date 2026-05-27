## Bug

`src/components/UsernameGate.tsx` 中的 effect：

```ts
useEffect(() => {
  if (open && !value) setValue(suggest());
}, [open, value]);
```

依赖里包含 `value`，所以玩家一旦把输入框删空，effect 立刻再次塞回 `Guardian####`，导致无法清空。

## 修复

### 1. `src/components/UsernameGate.tsx`
- 把"建议默认名"逻辑改成**只在 Gate 打开的瞬间执行一次**：用一个 `seededRef`（或依赖只看 `open`，进入 open=true 时填一次）。打开时填入建议名，之后任凭用户删空。
- 字符限制：
  - 输入框 `maxLength={16}` 保留。
  - 输入 `onChange` 中加 `value.slice(0, 16)` 双保险（IME 粘贴绕开 maxLength 的情况）。
  - 在输入框下方加一个右对齐的字符计数 `{value.length}/16`，超出/低于范围时变红。
- 提交按钮 disabled 当 `value.trim().length < 2`，避免一回车又被默认名顶回。

### 2. 不动 `validateUsername`
- 现有规则 `2–16` 字符、允许字母/数字/`_`/`-`/中文（`USERNAME_RE`）保持不变。

## 验证

1. 进入新会话，Username Gate 弹出 → 输入框预填 `GuardianXXXX`。
2. 全选删除 → 输入框保持为空，不会被恢复。
3. 输入超过 16 个字符 → 被截断到 16。
4. 计数器显示 `n/16`，<2 时按钮禁用。
5. 输入合法名 → 提交，主页头像 HUD 显示该名字，进度保留。
