# 演示 2A：Three.js 漂浮灯塔海岛（白昼 → 黄昏波光与萤火虫）

## 录屏启动方式

在当前目录起一个本地静态服务即可（无需装 Vite，已内置 `850ms` 文件轮询自动热更新）：

```sh
python3 -m http.server 8351
```

浏览器打开 `http://localhost:8351`：
- 按 **`H`** 隐藏或恢复面板，按 **`1`** 回看白昼起点。课堂版隐藏了黄昏预览；排练时可移除 `index.html` 中 `btn-v2` 按钮的 `hidden` 属性，刷新后即可使用该按钮和快捷键 **`2`**。
- 重置回白昼起点：`cp snapshots/v1-daylight.js scene-config.js`
- 直接切到参考黄昏版：`cp snapshots/v2-sunset-fireflies.js scene-config.js`

## 现场发给 Codex CLI 的纯 Vibe 提示词（建议）

```text
当前目录是一个 Three.js 漂浮灯塔海岛页面（氛围参数在 scene-config.js）。
现在的画面太像正午塑料玩具了，请帮我改成电影感的黄昏逆光氛围：
天空从深紫过渡到暖橙色并露出低垂的落日，海面加上金色波光反射和薄暮雾气，把灯塔旋转光束和小屋窗户的暖光点亮，再在岛上飘满发光的黄绿色萤火虫粒子。
请根据这些要求直接调整 scene-config.js 里的氛围参数，不要复制现成的预设，也不要加新依赖。
```
