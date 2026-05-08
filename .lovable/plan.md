# 选项选择后返回上一页保留所选状态

## 问题诊断

每个 chapter 当前用 `revealedAt: number | null` 来标记 ChoicePanel 是否处于"已揭晓"状态：

```ts
revealed={revealedAt === i}
```

`answers[step.key]` 状态本身是持久的，所以重新进入这一步时 **选项按钮仍然高亮**。但 `revealedAt` 只在"刚做出选择的同一步"为真，**回到上一页时 reveal banner（结果反馈、★BEST 标签、rationale 文字）会消失**，看起来像没选过。

## 解决方案

把"是否揭晓"从瞬态状态改为**根据答案派生**：只要 `answers[step.key]` 有值，就视为已揭晓。

```ts
// 替换:
revealed={revealedAt === i}
// 为:
revealed={!!answers[step.key]}
```

并移除每个 chapter 文件中：
- `const [revealedAt, setRevealedAt] = useState<number | null>(null);`
- `setRevealedAt(...)` 的调用（在 `next`、`choose`、`restart`、上一页按钮里）

## 影响

- 已答过的题在前后翻页时始终显示完整结果（选中态 + ★BEST/✕POOR 徽章 + rationale + reveal banner）。
- 已答的选项依然 disabled（由 `selected` 控制），不可重选。
- 选项之外的体验不变；翻译、奖励、ChoicePanel 内部逻辑都不动。

## 范围

修改 9 个 chapter 文件：
- `src/pages/story/SilentFall.tsx`
- `src/pages/story/GreenTrade.tsx`
- `src/pages/story/HighPayTrap.tsx`
- `src/pages/story/MaskOfAuthority.tsx`
- `src/pages/story/RitualOfPower.tsx`
- `src/pages/story/SilentDormitory.tsx`
- `src/pages/story/SilentRoom.tsx`
- `src/pages/story/TheRunner.tsx`
- `src/pages/story/DarkNight.tsx`

每个文件 3–5 处小改：删除 `revealedAt` 声明、把 `revealed=` 改为派生表达式、清理 `setRevealedAt` 调用。

## 不在本次范围

- 不改 `ChoicePanel` 组件本身
- 不改进度持久化逻辑（answers 已经存在 localStorage）
