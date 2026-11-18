# 3.5 外部帖子与网页截图登记表

> 截取日期：2026-11-18，工具：`uv run courseware/tools/capture-source.py`（X 帖子走官方嵌入页，未登录截取）。按课程 `docs/production/external-sources.md` 规则，已同时保留完整原始截取图与去除底部点赞/回复栏的上屏裁剪版。

| 拟用位置 | 文件名 | 尺寸 | 一手来源与日期 | 用途说明与复现命令 |
| --- | --- | --- | --- | --- |
| **PPT `p01`（推荐上屏）** | `karpathy-vibe-coding-cropped.png` | `1096×496` | Andrej Karpathy（`@karpathy`），2025-02-03<br>https://x.com/karpathy/status/1886192184808149383 | 裁去底部点赞与回复按钮，保留头像、正文（*There's a new kind of coding I call "vibe coding"... forget that the code even exists*）及日期 |
| `p01` 原始对照 | `karpathy-vibe-coding.png` | `1096×686` | 同上 | `uv run courseware/tools/capture-source.py https://x.com/karpathy/status/1886192184808149383 external-posts/karpathy-vibe-coding.png` |
| **切屏 1 佐证／断网兜底** | `levelsio-fly-pieter-post.png` | `1096×2028` | Pieter Levels（`@levelsio`），2025-03-04<br>https://x.com/levelsio/status/1896690611257844116 | 展示 `fly.pieter.com`（Cursor + Three.js 制作的免费联机飞行游戏）上线 10 天万余人游玩及内购广告盛况；录制现场可直接点开该帖内视频或访问 `https://fly.pieter.com/`（注：站点带 Cloudflare Turnstile 验证，录屏时由讲师在本人浏览器手动进入） |
| 切屏 1 场景参考 | `fly-pieter-live.png` | `2200×1800` | https://fly.pieter.com/ | 隐藏首屏浮层后的跑道与海面背景实景截取 |
| **PPT `p04`（推荐上屏）** | `jasonlk-code-freeze-deleted-cropped.png` | `875×825` | Jason Lemkin（`@jasonlk`），2025-07-18<br>https://x.com/jasonlk/status/1946069562723897802 | 取自该帖附图 1，直击灵魂一问一答：*“So you deleted our entire database without permission during a code and action freeze?” → “Yes. I deleted the entire database without permission during an active code and action freeze.”*（已裁去底部滚动浮标） |
| **PPT `p05`（推荐上屏）** | `jasonlk-replit-confession-cropped.png` | `1096×1305` | Jason Lemkin（`@jasonlk`），2025-07-18<br>https://x.com/jasonlk/status/1946066422477529487 | 裁去父帖与底部回复栏，清晰保留 `@jasonlk` 发帖头、*“I made a catastrophic error in judgment... because I panicked... violated the explicit directive 'NO MORE CHANGES without explicit permission'”* 与日期 |
| `p04`／`p05` 原始全图备查 | `jasonlk-replit-deleted-db.png`<br>`jasonlk-replit-confession.png`<br>`jasonlk-attachment-panicked.jpg`<br>`jasonlk-attachment-photo1.jpg` ~ `photo3.jpg` | 多尺寸 | 同上两条 X 原帖及其原始媒体附件 | 供核对完整事故脉络（含 1,206 名高管与 1,196+ 家公司记录被毁、`4:26 AM npm run db:push` 等原文细节，口播可据实引用） |
