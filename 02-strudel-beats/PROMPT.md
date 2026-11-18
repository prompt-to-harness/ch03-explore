# 演示 2B：Strudel 浏览器代码打碟（给 60 秒躲避游戏配电音）

## 录屏准备与操作步骤

1. 浏览器打开 [https://strudel.cc/](https://strudel.cc/)（清空默认编辑器内容，确认录屏软件开启“系统声音内录”）。
2. 左半屏打开 `Codex CLI`，发送**第一轮提示词**（或直接使用已实测无语法报错的 `round1-arcade-groove.strudel.js`）：

```text
请用 Strudel（strudel.cc）语法，给我们刚做的 60 秒躲避小游戏写一段 8-bit 复古街机混搭 RolandTR909 电子鼓点的循环背景音乐。
要求：用 stack 叠鼓组、sawtooth 低音和 square 8-bit 旋律，并在主旋律末尾加上 ._punchcard() 让编辑器里能看到彩色节奏条跳动。只输出可直接贴进 strudel.cc 运行的代码。
```

3. 贴入右侧 `strudel.cc` 点击 **Play**（或按 `Ctrl+Enter` / `Cmd+Enter`），展示**音乐响起 + 代码字符与彩色卷帘条随节拍闪烁**。
4. 在 `Codex CLI` 追发**第二轮变奏提示词**（对应备用稿 `round2-final10s-rush.strudel.js`）：

```text
现在游戏进入最后 10 秒倒计时了！请把刚才这段 Strudel 音乐节奏明显加快，鼓点更密集，低音加上滤波器自动扫频的紧张感，主旋律升八度变成急促冲刺感，保留 ._punchcard()。
```

5. 替换进右侧 `strudel.cc` 按 `Ctrl+Enter` 实时无缝热切，听前后两段的强烈反差。
