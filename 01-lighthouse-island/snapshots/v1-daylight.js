// V1 起点快照：正午塑料白昼版
export const SCENE_CONFIG = {
  presetName: "V1 · 正午塑料白昼",
  isSunset: false,

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

  fog: {
    color: "#bfe8ff",
    density: 0.0025,
  },

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

  ocean: {
    deepColor: "#1ca3ec",
    shallowColor: "#38bdf8",
    specularColor: "#aee6ff",
    shininess: 22,
    waveHeight: 0.22,
    waveSpeed: 1.0,
    goldenShimmerIntensity: 0.0,
  },

  lighthouse: {
    lanternEmissive: "#fff9c4",
    lanternIntensity: 0.35,
    beamColor: "#ffffff",
    beamOpacity: 0.04,
    beamSpeed: 0.7,
    cottageWindowEmissive: "#334155",
    cottageWindowIntensity: 0.0,
  },

  fireflies: {
    enabled: false,
    count: 0,
    primaryColor: "#fde047",
    secondaryColor: "#86efac",
    size: 0.28,
  },
};
