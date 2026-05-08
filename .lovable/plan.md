## 章节完成星星动画

在 `StarReward` 组件挂载（即结算面板出现）时，叠加一层全屏星星迸发动画，与现有 ⭐ 星数奖励同步。

### 视觉效果

- **中央大星脉冲**：屏幕中央一颗大金星缩放 + 发光（scale-in + 1.5s 脉冲），与"+XP / +⭐"数字呼应。
- **散射小星**：根据本次获得的总星数（`breakdown.total`）生成同等数量的小星粒子，从中心向外随机方向飞出 + 旋转 + 渐隐（约 1.2s）。3 星 ≈ 12 颗，5 星 ≈ 18 颗（数量= total × 4，封顶 24）。
- **底层闪光**：径向渐变金色光圈，0 → 100% 扩散后淡出。
- 动画总时长 ≈ 1.6s，结束后图层自动卸载，不阻挡用户继续操作。

### 技术实现

新增 `src/components/story/StarBurst.tsx`：
- Props: `count: number`（决定粒子数）、`onDone?: () => void`。
- `position: fixed inset-0 z-[9999] pointer-events-none`，挂载即播放。
- 粒子用 `useMemo` 生成数组，每颗带随机 `--tx / --ty / --rot / --delay` CSS 变量，通过内联 style 传入。
- 用现有 Tailwind `animate-scale-in` + 自定义 keyframes（在 `tailwind.config.ts` 的 keyframes 里新增 `star-fly`、`star-pop`、`star-glow`）。

`tailwind.config.ts` 追加：
- `star-fly`: `translate(0,0) rotate(0) scale(1) opacity(1) → translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(.4) opacity(0)`
- `star-pop`: 大星 `scale(0)` → `scale(1.4)` → `scale(1)` 弹性入场
- `star-glow`: 中心光环 `scale(0) opacity(.8)` → `scale(2.5) opacity(0)`

集成：
- `StarReward.tsx` 内增加 `const [burst, setBurst] = useState(true)`，`useEffect` 与 claim 同时触发；渲染 `{burst && <StarBurst count={breakdown.total} onDone={() => setBurst(false)} />}`。
- 用 `setTimeout(onDone, 1700)` 卸载，避免 DOM 遗留。
- 通过 `useSettings().playCue()` 在挂载瞬间播放一声音效（已有 API），增强反馈。

### 不在范围

- 不改星星计算 / XP 计算
- 不改其他页面（quiz 模态、首页等）
- 不引入新的动画库（沿用 Tailwind keyframes + framer-motion 不是必需）