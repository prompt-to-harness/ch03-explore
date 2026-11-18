# 第 3 章 3.5 · 演示小项目与外部截图素材包（`ch03-explore`）

本目录集中存放第 3 章 3.5 小节《走出网页：Vibe Coding 还能怎么疯（以及怎么翻车）？》的全部本地演示小项目、提示词与已核实外部帖子截图，独立于公开课件仓库，不污染个人主页项目。

## 一键启动全部演示总控台

在本目录启动静态服务：

```sh
cd /Users/liyang/Desktop/abula_project/open_class/ch03-explore
python3 -m http.server 8350
```

浏览器打开 **`http://localhost:8350/`** 即可看到可视化总控台，一键进入全部四个环节与截图预览。

## 目录结构与对应环节

| 目录 | 对应四幕环节 | 包含内容与录屏看点 |
| --- | --- | --- |
| `01-lighthouse-island/` | **第二幕 · 2A 视觉秀**<br>Three.js 漂浮灯塔海岛 | 已内置本地 `vendor/three.module.min.js` 与 `OrbitControls.js`（零外网依赖），并支持 `850ms` 自动检测 `scene-config.js` 改动热更新。默认是“正午塑料白昼版”，用 `PROMPT.md` 让 Codex CLI 改成“黄昏逆光 + 海面金色波光 + 萤火虫粒子”时右侧浏览器自动变色（按 `H` 可隐藏左上角状态框，按 `1`/`2` 可排练预演）。 |
| `02-strudel-beats/` | **第二幕 · 2B 听觉秀**<br>Strudel 代码打碟 | 含 `PROMPT.md` 及两份符合 `https://strudel.cc/` 官方语法的代码：`round1-arcade-groove.strudel.js`（124 BPM 复古 8-bit 混搭 909 电子鼓点，带 `._punchcard()` 彩色闪烁卷帘）与 `round2-final10s-rush.strudel.js`（162 BPM 最后 10 秒倒计时加速扫频冲刺变奏）。 |
| `03-jelly-chime/` | **第三幕 · 3A 触感怪玩具**<br>果冻水母风铃 | 单文件零依赖：弹簧质点柔性发光水母网格 ＋ Web Audio API 五声音阶玻璃风铃合成器（带立体声混响回声），支持鼠标拨动拖拽与“深海荧光 / 蜜桃软糖 / 极光水晶”三档切换。 |
| `04-all-eyes-open/` | **第三幕 · 3B 一次性工具**<br>全员睁眼合照合成器 | 内置 3 张像素级对齐的 AI 自制卡通聚会闭眼/打喷嚏废片（`assets/shot-1.jpg ~ shot-3.jpg`，零真人肖像隐私风险），支持真实拖入图片、一键扫描拼出 4/4 全员睁眼完美照、按住对比原废片，以及点击单个人物框切换不同连拍表情。 |
| `external-posts/` | **第一幕 `p01` & 第四幕 `p04`/`p05`**<br>一手原帖与截图 | 已核实并截取 Karpathy 造词原帖（`1886192184808149383`）、Pieter Levels `fly.pieter.com` 出圈帖（`1896690611257844116`）与 Jason Lemkin 直播删库事故双帖（`1946069562723897802`、`1946066422477529487`），均已备好上屏裁剪版与原始全图，出处清单见 `external-posts/README.md`。 |
