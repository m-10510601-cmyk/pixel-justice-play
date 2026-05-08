## Goal
把反馈系统从「仅本地保存」升级为「集中式意见箱」：玩家提交后写入云端表，只有创作者输入密码 `2054` 才能查看。

## 数据层（Lovable Cloud）
新建表 `public.feedbacks`：
- `id uuid pk default gen_random_uuid()`
- `message text not null` (限长 1000，trigger 校验)
- `lang text`
- `user_agent text`
- `created_at timestamptz default now()`

RLS：
- 启用 RLS。
- `INSERT`：允许任何人（`to public using (true) with check (length(message) between 1 and 1000)`）。
- `SELECT`：保持关闭（即默认拒绝）。意见箱通过 **edge function** 鉴权读取，避免暴露给浏览器端任意用户。

## 后端：edge function `feedback-inbox`
- `POST { password }` → 验证 `password === Deno.env.get("FEEDBACK_INBOX_PASSWORD")`（默认值 `2054`，作为 secret 添加）。
- 通过 `SUPABASE_SERVICE_ROLE_KEY` 读取 `feedbacks` 表，按 `created_at desc` 返回最近 200 条。
- 失败返回 401。
- `verify_jwt = false`（公开调用，靠密码鉴权）。

> 注：将 `FEEDBACK_INBOX_PASSWORD` 加为 secret，方便日后修改而不动代码。

## 前端

### 1. `src/components/HomeOverlays.tsx` — `FeedbackModal`
- 用 zod 校验 `message`：trim、1–1000 字符。
- 调用 `supabase.from('feedbacks').insert({ message, lang, user_agent })`。
- 失败时回退写 localStorage（兼容离线）。
- 提交成功显示「谢谢」。

### 2. 新组件 `src/components/InboxModal.tsx`
- 第一步：密码输入框（type="password"），错误时本地提示「密码错误」。
- 第二步：调用 edge function 拉取列表，`sessionStorage` 记住「已解锁」状态本会话内免输。
- 列表：显示时间戳 + 完整反馈文本 + 语言；空态文案。
- 按钮：刷新、关闭。

### 3. 入口位置
- **不放在主页 HUD**，避免普通玩家发现。
- 放在 `Settings` 页底部加一个不起眼的小按钮 `📥 INBOX`（或 emoji 信箱），点击打开 `InboxModal`。
- 同步加 i18n key：
  - `inbox.title` = INBOX / 意见箱 / PETI MASUK
  - `inbox.password` = ENTER PASSWORD / 输入密码 / KATA LALUAN
  - `inbox.unlock` = UNLOCK / 解锁 / BUKA
  - `inbox.wrong` = Wrong password / 密码错误 / Kata laluan salah
  - `inbox.empty` = No feedback yet / 暂无反馈 / Tiada maklum balas
  - `settings.inbox` = INBOX / 意见箱 / PETI MASUK

## 安全要点
- 密码校验在 edge function 服务端进行；前端只是表单。
- 客户端**无法**直接 select `feedbacks`（RLS 拒绝）。
- 输入用 zod 严格 trim + 长度限制，防止滥用与超长写入。
- 不在前端日志里输出反馈内容或密码。

## 不改的东西
- 现有反馈 UI 入口（HUD 的 ✉、Settings 的 FEEDBACK）保持原状，只是后端改为云端写入。
