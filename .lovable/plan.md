## 目标
点击头像弹出的 `AvatarDetailsModal` 所有内容严格收纳在外层金框内，自适应文字大小、行距、图片尺寸，避免溢出。

## 改动 `src/components/AvatarDetailsModal.tsx`

1. **外层容器统一金框**  
   将最外层 `pixel-btn border-accent` 改为 `.gold-box` + 四角铆钉，固定 `max-w-[360px] w-[calc(100%-2rem)]`，内边距 `p-4`，`max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col`，保证手机/桌面都不溢出。

2. **可滚动内容区**  
   头部标题/底部按钮 sticky 固定，中间内容 `flex-1 overflow-y-auto pr-1`，避免内容超出金框。

3. **头像图自适应**  
   头像尺寸从固定 96 改为 `clamp(64px, 22vw, 96px)` 通过 props，外层 padding 也按比例缩放，让小窗口不顶出金框。

4. **文字层级与行距统一**  
   - 标题 AVATAR：`text-xs sm:text-sm`  
   - 名称：`text-sm sm:text-base`，`leading-tight`  
   - Lv/解锁信息：`text-[10px] leading-snug`  
   - Bio：`text-[11px] sm:text-xs leading-relaxed`，`break-words`  
   - COLLECTION 标签：`text-[8px] leading-none`  
   全部走 Tailwind responsive，不写魔法数。

5. **子 box 内边距收紧**  
   Bio / Collection 的 `.gold-box` 内边距改 `p-2.5`，与外框留 `gap-3` 间距，视觉对齐外框。

6. **按钮区**  
   `flex-wrap gap-2 justify-end pt-3 border-t border-[hsl(var(--gold))/30]`，小屏按钮自动换行，文字 `text-[10px]`。

## 不动
- 业务逻辑、avatar 数据、解锁规则
- LevelDetailsModal、HUD、其他页面
- 颜色 token

## 技术细节
- `flex flex-col` 外层 + `overflow-y-auto` 中段是收纳关键
- 头像 size 用 JS `Math.round(Math.min(96, window.innerWidth * 0.22))` 在 mount 时算一次，或简单用 `useState + resize listener`；优先用 CSS clamp 通过 wrapper width 实现，render(size) 取 wrapper 实测后传入
- 由于 `avatar.render(size)` 是数值入参，用 `useEffect + ResizeObserver` 监听 wrapper 宽度，size = `Math.round(width * 0.8)`，min 56 max 96
