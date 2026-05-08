## Chapter 9 法律洞察：改为 Basikal Lajak 案启发 + 深度解释

### 背景
第 9 章 *Dark Night* 末尾原有一段 "📜 Insight · The Syndicate Hook"（团伙线索），与 Green Trade / High-Pay Trap 串联。用户希望将这段 Insight 改为受 **Basikal Lajak 案**（2017 柔佛 8 少年踏夜骑改装自行车遭撞身亡，司机 Sam Ke Ting 经多审最终于 2023 联邦法院无罪释放）启发，并补充进一步说明。

### 改动

1. **替换原 Insight**（位于 `src/pages/story/DarkNight.tsx` 第 297–302 行）

   新标题：`📜 Insight · Inspired by the Basikal Lajak Case`

   正文（约 4 段）：
   - **案件梗概**：2017 年 2 月 18 日凌晨约 3:20，柔佛新山，8 名 13–17 岁少年骑改装无刹车的 "basikal lajak" 在公路上滑行，被一名 22 岁女司机 Sam Ke Ting 驾驶的 Sazuki Vivo 撞上，造成 8 人死亡。事故路段限速 70 km/h，车辆鉴定速度约 44–45 km/h。
   - **司法历程**：2019 推事庭判无罪 → 2021 高庭推翻改判鲁莽驾驶致死，6 年监禁 + RM6,000 罚款 → 2022 上诉庭维持 → **2023 联邦法院最终撤销定罪，宣告无罪**。理由：控方未能在合理怀疑之外证明被告"鲁莽或危险"驾驶。
   - **本章映射**：本案的核心张力——少年群体的可责性 vs 驾驶人的注意义务 vs 监管缺位——正是本章选择题（q9a 责任分配、q9b 责任程度、q9c 多方归因）的法理原型。

2. **新增第二段 Insight（深度解释）**：紧接其后插入新的 `kind: "insight"` 项

   标题：`⚖ Insight · Legal Doctrines Unpacked`

   正文（要点逐条）：
   - **举证标准（Beyond Reasonable Doubt）**：刑事案件中，控方须将"鲁莽或危险驾驶"证明至排除合理怀疑的程度。Federal Court 认定控方未达此标准，是无罪的核心法律根据。
   - **Mens Rea（犯罪心态）**：第 41/42 条道路交通法令下的鲁莽驾驶要求被告至少疏忽至 *gross negligence* 程度。"在限速以内 + 路段昏暗 + 受害者非法在道路中央" → 难以推导出 mens rea。
   - **Contributory Negligence（受害者共同过失）**：受害者本身的不法/危险行为（无照、无灯、改装车、凌晨上路）会大幅削弱驾驶人的因果可责性。这正是本章 q9b "partial liability" 选项的直接对应。
   - **Multi-Party Responsibility（多方归因）**：父母监管、地方政府执法、道路照明设计、社交媒体推动青少年炫技文化——任何单一指责都不完整。q9c 的 "高分隐藏答案 D" 直接呼应这点。
   - **教训**：法律不能只回答"谁去坐牢"，更要回答"如何阻止下一次"。Basikal Lajak 后，柔佛与多州陆续禁售改装 lajak、推动校园安全教育与道路照明升级——这是判决之外的真正立法回响。

### 文件变更
- `src/pages/story/DarkNight.tsx`：替换第 297–302 行的 insight，并在其后追加一个新的 insight step；不动 `gradeEnding`、选项数据、其他章节。

### 不在范围
- 不改本章选项 / 计分逻辑
- 不改其他章节
- 不做 i18n 翻译（与本章其他英文文本一致，沿用 `<T>` 在运行时翻译）