// V2 对照版：电影感黄昏逆光 + 海面金色波光反射 + 雾气灯塔光束 + 漂浮萤火虫粒子
export const SCENE_CONFIG = {
  presetName: "V2 · 黄昏逆光与萤火虫",
  isSunset: true,

  sky: {
    zenithColor: "#141036",
    midColor: "#6d296b",
    horizonColor: "#ff7e36",
    showSunDisc: true,
    sunColor: "#fff0b8",
    sunGlowColor: "#ff6b2b",
    sunElevation: 0.095,
    sunAzimuth: -2.55,
  },

  fog: {
    color: "#43234c",
    density: 0.0115,
  },

  lighting: {
    ambientSkyColor: "#a855f7",
    ambientGroundColor: "#fb923c",
    ambientIntensity: 0.65,
    sunLightColor: "#ff8c3b",
    sunLightIntensity: 2.8,
    sunPosition: [-34, 7.5, -28],
    rimLightColor: "#ffd166",
    rimLightIntensity: 1.9,
    exposure: 1.18,
  },

  ocean: {
    deepColor: "#17143a",
    shallowColor: "#3b2358",
    specularColor: "#ffb74d",
    shininess: 140,
    waveHeight: 0.34,
    waveSpeed: 1.25,
    goldenShimmerIntensity: 1.0,
  },

  lighthouse: {
    lanternEmissive: "#fde047",
    lanternIntensity: 2.6,
    beamColor: "#fef08a",
    beamOpacity: 0.24,
    beamSpeed: 0.85,
    cottageWindowEmissive: "#ff9f1c",
    cottageWindowIntensity: 2.2,
  },

  fireflies: {
    enabled: true,
    count: 190,
    primaryColor: "#fde047",
    secondaryColor: "#6ee7b7",
    size: 0.42,
  },
};
