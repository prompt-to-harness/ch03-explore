// 当前场景光影与氛围参数（Codex CLI 现场修改此文件后，浏览器会自动热更新）
export const SCENE_CONFIG = {
  presetName: "V1 · 正午塑料白昼",
  isSunset: false,

  // 天空三段色（天顶 → 中空 → 海平线）与太阳圆盘
  sky: {
    zenithColor: "#4da6ff",
    midColor: "#87cefa",
    horizonColor: "#d8f3ff",
    showSunDisc: false,
    sunColor: "#ffffff",
    sunGlowColor: "#ffffff",
    sunElevation: 0.62,
    sunAzimuth: 0.6,
  },

  // 雾气
  fog: {
    color: "#bfe8ff",
    density: 0.0025,
  },

  // 光照（正午顶光、无逆光暖色）
  lighting: {
    ambientSkyColor: "#ffffff",
    ambientGroundColor: "#9dc4e0",
    ambientIntensity: 1.15,
    sunLightColor: "#ffffff",
    sunLightIntensity: 1.4,
    sunPosition: [18, 34, 20],
    rimLightColor: "#ffffff",
    rimLightIntensity: 0.0,
    exposure: 1.0,
  },

  // 海面材质与金色波光反射
  ocean: {
    deepColor: "#1ca3ec",
    shallowColor: "#38bdf8",
    specularColor: "#aee6ff",
    shininess: 22,
    waveHeight: 0.22,
    waveSpeed: 1.0,
    goldenShimmerIntensity: 0.0,
  },

  // 灯塔旋转光束与小屋窗户灯光
  lighthouse: {
    lanternEmissive: "#fff9c4",
    lanternIntensity: 0.35,
    beamColor: "#ffffff",
    beamOpacity: 0.04,
    beamSpeed: 0.7,
    cottageWindowEmissive: "#334155",
    cottageWindowIntensity: 0.0,
  },

  // 萤火虫粒子
  fireflies: {
    enabled: false,
    count: 0,
    primaryColor: "#fde047",
    secondaryColor: "#86efac",
    size: 0.28,
  },
};
