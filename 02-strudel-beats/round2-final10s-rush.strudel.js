// 演示 2B · 第二轮：最后 10 秒倒计时冲刺变奏（节奏加快 + 酸性滤波扫频 + 高音警报琶音）
setcpm(162 / 4)

stack(
  // 疾速四踩底鼓 + 密集滚奏军鼓与开镲
  s("bd*4, [~ cp]*2, [hh hh oh hh]*4")
    .bank("RolandTR909")
    .gain(0.92)
    .color("#fb7185"),

  // 酸性合成器狂飙低音（带正弦波实时扫频）
  note("<c2 eb2 f2 f#2>*8")
    .s("sawtooth")
    .lpf(sine.range(450, 2600).fast(2))
    .lpq(7)
    .decay(0.11)
    .sustain(0.1)
    .gain(0.78)
    .color("#f97316"),

  // 倒计时冲刺双倍速 8-bit 琶音（内嵌彩色动态瀑布条）
  note("<[c5 eb5 g5 c6]*2 [f5 ab5 c6 eb6]*2 [g5 bb5 d6 f6]*2 [f#5 a5 c6 eb6]*2>")
    .s("square")
    .lpf(3600)
    .decay(0.09)
    .sustain(0)
    .room(0.4)
    .delay(0.25)
    .gain(0.58)
    .color("#fde047")
    ._punchcard()
)
