# 优化对话系统 · 精简剧情对话

## 目标

当前 9 个 chapter 每个 scene 平均有 6–8 行对话，玩家阅读体验偏长。本次优化只动**剧情对话文本本身**，保留：
- 案件关键线索（证物、时间、人物动机）
- 主角内心独白中点出"调查方向"的那一句
- 每个 scene 的转折/钩子

不改：选项 (Choice)、证据板 (Evidence)、Insight 段、奖励系统、对话播放器组件 (`SceneDialogue`)、翻译系统。

## 精简规则

1. **每个 scene 控制在 3–5 行**（目前常 6–8 行），优先合并意思相近的句子。
2. **删除装饰性旁白**（环境氛围句，如 "灯闪了一下"），除非它本身就是线索。
3. **内心独白**每个 scene 最多保留 2 条，挑最能推动调查的那两句。
4. **NPC 台词**保留含信息量的句子，删除纯情绪铺垫；长句拆短，去掉客套话。
5. **不删除 scene 本身**，节奏和场景数保持不变，只压缩每段长度。
6. **保持英文原文**（翻译走 i18n live 系统，不用动）。

## 范围

只编辑 9 个 story 文件中的 `STORY` 数组里 `kind: "scene"` 段的 `lines` 数组：

- `src/pages/story/SilentFall.tsx`
- `src/pages/story/GreenTrade.tsx`
- `src/pages/story/HighPayTrap.tsx`
- `src/pages/story/MaskOfAuthority.tsx`
- `src/pages/story/RitualOfPower.tsx`
- `src/pages/story/SilentDormitory.tsx`
- `src/pages/story/SilentRoom.tsx`
- `src/pages/story/TheRunner.tsx`
- `src/pages/story/DarkNight.tsx`

预期每个文件减少约 30–40% 的 dialogue 行数。

## 示例（SilentFall · Scene 1）

```text
Before (7 行):
  Principal: "Please, have a seat. This is a tragedy, but it appears to be an unfortunate accident."
  You (inner): "He answered before I even asked a question."
  Parent: "No. She was not happy there. Something was wrong for months."
  Principal: "With respect, students always have minor conflicts. We saw nothing serious."
  You (inner): "'Saw nothing' — or chose not to look?"
  Parent: "She stopped calling home. She used to call every night."
  You (inner): "Two completely different narratives… one of them is hiding something."

After (4 行):
  Principal: "An unfortunate accident. Please, have a seat."
  You (inner): "He answered before I asked."
  Parent: "She stopped calling home. Something was wrong for months."
  You (inner): "Two narratives. One is hiding something."
```

## 验证

- `bun run build` 通过，无引用错误
- 抽 1–2 个 chapter 在预览中跑一遍，确认 scene 仍能讲通故事

## 不在本次范围

- 不调整 `SceneDialogue` 的打字速度 / auto pause（如需可下次再做）
- 不改选项文案、证据内容、Insight 文案
- 不改奖励逻辑

