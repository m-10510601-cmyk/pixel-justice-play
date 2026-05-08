# 剧情精简后审计报告 + 钩子修复

## 审计结果总览

通过解析全部 9 章共 **64 个 scene**，对每个 scene 统计 NPC 台词、内心独白、旁白数量，并检查最后一行是否为内心独白钩子。

| 文件 | scene 总数 | 以 inner 结尾 | 以 NPC 结尾 | 以旁白结尾 |
|---|---|---|---|---|
| SilentFall | 6 | 6 | 0 | 0 |
| GreenTrade | 7 | 6 | **1** | 0 |
| HighPayTrap | 10 | 9 | **1** | 0 |
| MaskOfAuthority | 9 | 9 | 0 | 0 |
| RitualOfPower | 9 | 9 | 0 | 0 |
| SilentDormitory | 10 | 9 | **1** | 0 |
| SilentRoom | 7 | 6 | 0 | **1** |
| TheRunner | 10 | 6 | **4** | 0 |
| DarkNight | 10 | 10 | 0 | 0 |

✅ **NPC 关键台词** 全部保留 — 每章每个 scene 都至少有 NPC/inner/narr 中应有的角色，没有出现"NPC 全被删光"的情况。
✅ **大多数 scene** 仍以内心独白收尾 (ending hook)。

## 待补"内心钩子"的弱点 scene

下列 7 个 scene 当前以 NPC 台词或旁白结尾，缺少主角内心反思的"调查方向钩子"。建议在末尾追加 **1 行** `{ who: "You", inner: true, ... }`，不动现有内容。

### 1. `GreenTrade.tsx` · Act VIII · Final Reflection
当前以 `You: "We didn't catch a dealer. We found a doorway."` 结尾。这本身已是有力收束，可不改。**建议：不动**。

### 2. `HighPayTrap.tsx` · Act I · The Opportunity
3 行全是 Friend / Mei 对话。
**追加：** `{ who: "Mei", inner: true, text: "Six months' pay in one month… too good to be real?" }`

### 3. `SilentDormitory.tsx` · Act I · The Seed of Suspicion (Day 1)
4 行全是学生指控。受害者沉默后无主角视角。
**追加：** `{ who: "You", inner: true, text: "Four voices. One target. No proof yet — only momentum." }`

### 4. `SilentRoom.tsx` · Act IV · Hidden Records
末行是数据陈述，钩子在中间。
**调整：** 把已有内心独白移到末尾，或末尾追加 `{ who: "You", inner: true, text: "Seven 'accidents'. None of them was." }`

### 5. `TheRunner.tsx` · Scene 3 · The Collection
对话即"作案现场"，可保留戏剧性 NPC 收尾。**建议：不动**。

### 6. `TheRunner.tsx` · Scene 4 · Suspicion
当前以 Mr. Tan 自述结尾。
**追加：** `{ who: "You", inner: true, text: "He's not the suspect. He's the proof." }`

### 7. `TheRunner.tsx` · Scene 7 · Breaking Point
审讯收尾在嫌犯"我需要钱"。可作为戏剧停顿。
**追加：** `{ who: "You", inner: true, text: "Need is not a defence — but it tells me who recruited him." }`

### 8. `TheRunner.tsx` · Ending · Reflection
全 NPC 三连。叙述者+你的双台词已经是反思结构。**建议：不动**。

## 范围

只在 4 个 scene 末尾追加 1 行 inner 独白：
- `HighPayTrap.tsx` Act I
- `SilentDormitory.tsx` Act I
- `SilentRoom.tsx` Act IV（追加 1 行）
- `TheRunner.tsx` Scene 4
- `TheRunner.tsx` Scene 7

总共新增 **5 行**对话，不删除任何现有内容，不动选项/证据/Insight。

## 不在本次范围

- 不再次精简对话
- 不修改奖励/翻译/对话播放器

