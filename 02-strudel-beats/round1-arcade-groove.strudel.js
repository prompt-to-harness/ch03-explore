// 演示 2B · 第一轮：轻松复古 8-bit 混搭电子鼓点（粘贴到 https://strudel.cc 点 Play 或按 Ctrl+Enter）
setcpm(124 / 4)

stack(
  // 电子鼓组：底鼓 + 军鼓 + 轻快踩镲
  s("bd ~ [bd ~] sd, hh*8")
    .bank("RolandTR909")
    .gain(0.85)
    .color("#38bdf8"),

  // 温暖脉冲低音 Bassline
  note("<c2 f2 g2 eb2>*4")
    .s("sawtooth")
    .lpf(720)
    .decay(0.18)
    .sustain(0.15)
    .gain(0.72)
    .color("#a855f7"),

  // 8-bit 街机跳跃主旋律（自带钢琴卷帘动态高亮）
  note("<[c4 eb4 g4 bb4] [f4 ab4 c5 g4] [g4 bb4 d5 c5] [eb4 g4 bb4 g4]>")
    .s("square")
    .lpf(2400)
    .decay(0.14)
    .sustain(0.05)
    .room(0.35)
    .gain(0.55)
    .color("#facc15")
    ._punchcard()
)
