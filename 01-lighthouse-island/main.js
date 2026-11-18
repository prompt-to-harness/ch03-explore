import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SCENE_CONFIG as INITIAL_CONFIG } from "./scene-config.js";
import { SCENE_CONFIG as V2_PRESET } from "./snapshots/v2-sunset-fireflies.js";

const wrap = document.getElementById("canvas-wrap");
const badgeEl = document.getElementById("mode-badge");
const hudEl = document.getElementById("hud");
const btnV1 = document.getElementById("btn-v1");
const btnV2 = document.getElementById("btn-v2");

const V1_PRESET = structuredClone(INITIAL_CONFIG);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
wrap.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 320);
camera.position.set(17.5, 9.5, 22.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.target.set(0, 3.2, 0);
controls.minDistance = 10;
controls.maxDistance = 52;
controls.maxPolarAngle = Math.PI * 0.485;

// --- 1. Sky Dome Shader (3-stop gradient + optional low sun disc & halo) ---
const skyUniforms = {
  uZenith: { value: new THREE.Color() },
  uMid: { value: new THREE.Color() },
  uHorizon: { value: new THREE.Color() },
  uSunDir: { value: new THREE.Vector3(0, 1, 0) },
  uSunColor: { value: new THREE.Color() },
  uSunGlow: { value: new THREE.Color() },
  uShowSun: { value: 0.0 },
};

const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  uniforms: skyUniforms,
  vertexShader: `
    varying vec3 vWorldDir;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldDir = normalize(wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: `
    uniform vec3 uZenith;
    uniform vec3 uMid;
    uniform vec3 uHorizon;
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    uniform vec3 uSunGlow;
    uniform float uShowSun;
    varying vec3 vWorldDir;
    void main() {
      vec3 d = normalize(vWorldDir);
      float h = clamp(d.y * 0.5 + 0.06, 0.0, 1.0);
      vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.34, h));
      col = mix(col, uZenith, smoothstep(0.28, 0.92, h));
      if (uShowSun > 0.5) {
        float mu = max(dot(d, normalize(uSunDir)), 0.0);
        float halo = pow(mu, 9.0) * 0.65 + pow(mu, 48.0) * 0.85;
        float disc = smoothstep(0.9965, 0.9988, mu);
        col += uSunGlow * halo;
        col = mix(col, uSunColor, disc);
      }
      gl_FragColor = vec4(col, 1.0);
    }
  `,
});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(180, 48, 32), skyMat));

// --- 2. Lights ---
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x9dc4e0, 1.1);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 2;
sunLight.shadow.camera.far = 95;
const dCam = 18;
sunLight.shadow.camera.left = -dCam;
sunLight.shadow.camera.right = dCam;
sunLight.shadow.camera.top = dCam;
sunLight.shadow.camera.bottom = -dCam;
scene.add(sunLight);

const rimLight = new THREE.DirectionalLight(0xffd166, 0.0);
rimLight.position.set(-22, 5, -20);
scene.add(rimLight);

const cottagePointLight = new THREE.PointLight(0xff9f1c, 0, 8, 2);
cottagePointLight.position.set(-2.9, 3.6, 2.3);
scene.add(cottagePointLight);

// --- 3. Animated Ocean with Golden Sunset Glitter Shader ---
const oceanGeo = new THREE.PlaneGeometry(240, 240, 150, 150);
oceanGeo.rotateX(-Math.PI / 2);

const oceanUniforms = {
  uTime: { value: 0 },
  uWaveHeight: { value: 0.22 },
  uWaveSpeed: { value: 1.0 },
  uDeepColor: { value: new THREE.Color("#1ca3ec") },
  uShallowColor: { value: new THREE.Color("#38bdf8") },
  uSpecColor: { value: new THREE.Color("#aee6ff") },
  uShininess: { value: 22.0 },
  uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.4) },
  uShimmer: { value: 0.0 },
  uFogColor: { value: new THREE.Color("#bfe8ff") },
  uFogDensity: { value: 0.0025 },
};

const oceanMat = new THREE.ShaderMaterial({
  uniforms: oceanUniforms,
  vertexShader: `
    uniform float uTime;
    uniform float uWaveHeight;
    uniform float uWaveSpeed;
    varying vec3 vWorldPos;
    varying vec3 vNormalW;
    varying float vWave;

    float waveFn(vec2 p, float t) {
      float w = sin(p.x * 0.36 + t * 1.4) * 0.45;
      w += cos(p.y * 0.29 - t * 1.15) * 0.38;
      w += sin((p.x + p.y) * 0.62 + t * 2.05) * 0.18;
      w += cos((p.x * 0.9 - p.y * 0.7) + t * 2.7) * 0.09;
      return w * uWaveHeight;
    }

    void main() {
      float t = uTime * uWaveSpeed;
      vec3 pos = position;
      float eps = 0.35;
      float h0 = waveFn(pos.xz, t);
      float hx = waveFn(pos.xz + vec2(eps, 0.0), t);
      float hz = waveFn(pos.xz + vec2(0.0, eps), t);
      pos.y += h0;
      vec3 n = normalize(vec3(h0 - hx, eps, h0 - hz));
      vNormalW = n;
      vWave = h0;
      vec4 wp = modelMatrix * vec4(pos, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: `
    uniform vec3 uDeepColor;
    uniform vec3 uShallowColor;
    uniform vec3 uSpecColor;
    uniform float uShininess;
    uniform vec3 uSunDir;
    uniform float uShimmer;
    uniform vec3 uFogColor;
    uniform float uFogDensity;
    varying vec3 vWorldPos;
    varying vec3 vNormalW;
    varying float vWave;

    void main() {
      vec3 V = normalize(cameraPosition - vWorldPos);
      vec3 N = normalize(vNormalW);
      vec3 L = normalize(uSunDir);
      float distToIsland = length(vWorldPos.xz);
      float coastal = 1.0 - smoothstep(5.5, 16.0, distToIsland);
      vec3 base = mix(uDeepColor, uShallowColor, clamp(coastal * 0.75 + vWave * 0.8 + 0.25, 0.0, 1.0));

      // Foam ring around island shoreline
      float foam = smoothstep(0.45, 0.92, coastal) * smoothstep(-0.05, 0.2, vWave);
      base = mix(base, vec3(0.95, 0.97, 1.0), foam * 0.42);

      // Fresnel + specular sun path
      float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2);
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), uShininess);
      // Extra broken sparkle path in sunset mode
      float sparkle = pow(max(dot(reflect(-L, N), V), 0.0), 36.0) * uShimmer * 1.45;
      vec3 col = base + uSpecColor * (spec * 0.85 + sparkle + fresnel * 0.18 * (0.3 + uShimmer));

      // Exponential fog
      float d = length(cameraPosition - vWorldPos);
      float fogF = 1.0 - exp(-uFogDensity * uFogDensity * d * d);
      col = mix(col, uFogColor, clamp(fogF, 0.0, 1.0));

      gl_FragColor = vec4(col, 1.0);
    }
  `,
});
const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
oceanMesh.position.y = 0;
scene.add(oceanMesh);

// --- 4. Floating Low-Poly Island, Lighthouse, Cottage, Trees & Boat ---
const islandGroup = new THREE.Group();
scene.add(islandGroup);

function jitterGeometry(geo, amount = 0.22) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const seed = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    const n = (seed - Math.floor(seed)) - 0.5;
    pos.setXYZ(i, x + n * amount, y + n * amount * 0.45, z + n * amount);
  }
  geo.computeVertexNormals();
  return geo;
}

// Rock base & grassy plateau
const cliffGeo = jitterGeometry(new THREE.CylinderGeometry(6.8, 2.1, 4.6, 11, 3), 0.42);
const cliffMat = new THREE.MeshStandardMaterial({ color: 0x7c6254, roughness: 0.9, flatShading: true });
const cliff = new THREE.Mesh(cliffGeo, cliffMat);
cliff.position.y = -0.35;
cliff.castShadow = true;
cliff.receiveShadow = true;
islandGroup.add(cliff);

const grassGeo = jitterGeometry(new THREE.CylinderGeometry(6.5, 6.9, 1.25, 12, 2), 0.26);
const grassMat = new THREE.MeshStandardMaterial({ color: 0x569c52, roughness: 0.82, flatShading: true });
const grass = new THREE.Mesh(grassGeo, grassMat);
grass.position.y = 2.15;
grass.castShadow = true;
grass.receiveShadow = true;
islandGroup.add(grass);

// Sandy beach ledge
const sandGeo = jitterGeometry(new THREE.CylinderGeometry(3.2, 3.8, 0.7, 9, 1), 0.2);
const sandMat = new THREE.MeshStandardMaterial({ color: 0xe9c893, roughness: 0.88, flatShading: true });
const sand = new THREE.Mesh(sandGeo, sandMat);
sand.position.set(3.4, 0.45, 3.2);
sand.receiveShadow = true;
islandGroup.add(sand);

// Wooden pier & little sailboat
const pierMat = new THREE.MeshStandardMaterial({ color: 0x8d5b3c, roughness: 0.85, flatShading: true });
const pierDeck = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 3.6), pierMat);
pierDeck.position.set(4.5, 0.72, 5.4);
pierDeck.rotation.y = 0.55;
pierDeck.castShadow = true;
islandGroup.add(pierDeck);

const boatGroup = new THREE.Group();
const hull = new THREE.Mesh(
  new THREE.CylinderGeometry(0.65, 0.35, 0.5, 6),
  new THREE.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.7, flatShading: true })
);
hull.scale.set(0.85, 1, 1.85);
const sail = new THREE.Mesh(
  new THREE.ConeGeometry(0.75, 1.9, 3),
  new THREE.MeshStandardMaterial({ color: 0xfff8eb, roughness: 0.6, flatShading: true })
);
sail.position.set(0, 1.15, 0);
boatGroup.add(hull, sail);
boatGroup.position.set(6.8, 0.25, 6.9);
boatGroup.rotation.y = -0.5;
scene.add(boatGroup);

// Lighthouse (striped red & white)
const lighthouseGroup = new THREE.Group();
lighthouseGroup.position.set(1.1, 2.75, -0.8);
islandGroup.add(lighthouseGroup);

const stripeColors = [0xf8fafc, 0xdc2626, 0xf8fafc, 0xdc2626, 0xf8fafc];
let curY = 0;
for (let i = 0; i < stripeColors.length; i++) {
  const h = 1.15;
  const rBottom = 1.38 - i * 0.11;
  const rTop = 1.38 - (i + 1) * 0.11;
  const seg = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBottom, h, 10),
    new THREE.MeshStandardMaterial({ color: stripeColors[i], roughness: 0.65, flatShading: true })
  );
  seg.position.y = curY + h / 2;
  seg.castShadow = true;
  seg.receiveShadow = true;
  lighthouseGroup.add(seg);
  curY += h;
}

// Gallery deck + glass lantern + red roof
const deck = new THREE.Mesh(
  new THREE.CylinderGeometry(1.08, 0.95, 0.28, 10),
  new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, flatShading: true })
);
deck.position.y = curY + 0.14;
lighthouseGroup.add(deck);

const lanternMat = new THREE.MeshStandardMaterial({
  color: 0xfef9c3,
  emissive: 0xfff9c4,
  emissiveIntensity: 0.35,
  roughness: 0.2,
});
const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.95, 10), lanternMat);
lantern.position.y = curY + 0.72;
lighthouseGroup.add(lantern);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(0.95, 0.9, 10),
  new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6, flatShading: true })
);
roof.position.y = curY + 1.62;
lighthouseGroup.add(roof);

// Rotating Volumetric Lighthouse Beams (dual opposing cones)
const beamPivot = new THREE.Group();
beamPivot.position.y = curY + 0.72;
lighthouseGroup.add(beamPivot);

const beamUniforms = {
  uColor: { value: new THREE.Color(0xffffff) },
  uOpacity: { value: 0.04 },
};
const beamMat = new THREE.ShaderMaterial({
  uniforms: beamUniforms,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexShader: `
    varying float vDist;
    varying vec3 vNormalV;
    varying vec3 vViewDir;
    void main() {
      // Cone tip is at local origin (0,0,0), extends to z = -24 after rotateX
      vDist = clamp(length(position) / 24.0, 0.0, 1.0);
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vNormalV = normalize(normalMatrix * normal);
      vViewDir = normalize(-mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vDist;
    varying vec3 vNormalV;
    varying vec3 vViewDir;
    void main() {
      float axialFade = pow(1.0 - vDist, 1.85);
      float edgeSoft = pow(abs(dot(normalize(vNormalV), normalize(vViewDir))), 0.85);
      gl_FragColor = vec4(uColor, uOpacity * axialFade * (0.35 + 0.65 * edgeSoft));
    }
  `,
});

function createLightCone(sign) {
  const coneGeo = new THREE.ConeGeometry(3.4, 24, 24, 1, true);
  coneGeo.translate(0, -12, 0);
  coneGeo.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(coneGeo, beamMat);
  mesh.rotation.y = sign > 0 ? 0 : Math.PI;
  mesh.rotation.x = 0.08;
  return mesh;
}
beamPivot.add(createLightCone(1), createLightCone(-1));

// Keeper's Cottage with Emissive Windows
const cottageGroup = new THREE.Group();
cottageGroup.position.set(-2.3, 2.75, 1.5);
cottageGroup.rotation.y = 0.42;
islandGroup.add(cottageGroup);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 1.5, 1.8),
  new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85, flatShading: true })
);
walls.position.y = 0.75;
walls.castShadow = true;
walls.receiveShadow = true;
cottageGroup.add(walls);

const cottageRoof = new THREE.Mesh(
  new THREE.ConeGeometry(1.85, 1.15, 4),
  new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.75, flatShading: true })
);
cottageRoof.position.y = 2.05;
cottageRoof.rotation.y = Math.PI / 4;
cottageRoof.castShadow = true;
cottageGroup.add(cottageRoof);

const windowMat = new THREE.MeshStandardMaterial({
  color: 0x475569,
  emissive: 0x334155,
  emissiveIntensity: 0.0,
  roughness: 0.3,
});
for (const wx of [-0.52, 0.52]) {
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.48), windowMat);
  win.position.set(wx, 0.82, 0.91);
  cottageGroup.add(win);
}

// Stylized Pine Trees & Rocks
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9, flatShading: true });
const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f7d44, roughness: 0.8, flatShading: true });

const treeSpots = [
  [-3.8, 2.7, -1.5, 1.1],
  [-2.6, 2.75, -3.1, 0.92],
  [-0.6, 2.75, -3.8, 1.2],
  [3.6, 2.7, -2.1, 0.95],
  [4.1, 2.65, 0.5, 0.85],
  [-4.4, 2.65, 0.9, 0.9],
  [0.2, 2.75, 3.6, 0.8],
];
for (const [tx, ty, tz, s] of treeSpots) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 0.85, 6), trunkMat);
  trunk.position.y = 0.42;
  const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.45, 7), leafMat);
  c1.position.y = 1.25;
  const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.2, 7), leafMat);
  c2.position.y = 2.0;
  c1.castShadow = c2.castShadow = true;
  tree.add(trunk, c1, c2);
  tree.position.set(tx, ty, tz);
  tree.scale.setScalar(s);
  islandGroup.add(tree);
}

// --- 5. Glowing Firefly Particle System ---
const MAX_FIREFLIES = 260;
const fireflyGeo = new THREE.BufferGeometry();
const ffPositions = new Float32Array(MAX_FIREFLIES * 3);
const ffColors = new Float32Array(MAX_FIREFLIES * 3);
const ffSeeds = new Float32Array(MAX_FIREFLIES * 4);

for (let i = 0; i < MAX_FIREFLIES; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.4 + Math.random() * 6.8;
  ffPositions[i * 3] = Math.cos(angle) * radius;
  ffPositions[i * 3 + 1] = 1.6 + Math.random() * 5.8;
  ffPositions[i * 3 + 2] = Math.sin(angle) * radius;

  ffSeeds[i * 4] = angle;
  ffSeeds[i * 4 + 1] = radius;
  ffSeeds[i * 4 + 2] = ffPositions[i * 3 + 1];
  ffSeeds[i * 4 + 3] = Math.random() * 10.0;
}
fireflyGeo.setAttribute("position", new THREE.BufferAttribute(ffPositions, 3));
fireflyGeo.setAttribute("color", new THREE.BufferAttribute(ffColors, 3));

// Create soft radial glow sprite texture via canvas (zero external assets)
const spriteCanvas = document.createElement("canvas");
spriteCanvas.width = spriteCanvas.height = 64;
const sctx = spriteCanvas.getContext("2d");
const grad = sctx.createRadialGradient(32, 32, 2, 32, 32, 30);
grad.addColorStop(0, "rgba(255, 255, 255, 1)");
grad.addColorStop(0.35, "rgba(255, 245, 180, 0.75)");
grad.addColorStop(1, "rgba(255, 200, 80, 0)");
sctx.fillStyle = grad;
sctx.fillRect(0, 0, 64, 64);

const fireflyMat = new THREE.PointsMaterial({
  size: 0.38,
  map: new THREE.CanvasTexture(spriteCanvas),
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
scene.add(fireflyPoints);

// --- 6. Apply Config & Live Hot-Reload Polling ---
let activeConfig = structuredClone(INITIAL_CONFIG);

function applySceneConfig(cfg) {
  activeConfig = cfg;
  badgeEl.textContent = cfg.presetName || "自定义氛围";
  badgeEl.classList.toggle("is-sunset", Boolean(cfg.isSunset));
  btnV1.classList.toggle("is-active", !cfg.isSunset);
  btnV2.classList.toggle("is-active", Boolean(cfg.isSunset));

  // Sky
  skyUniforms.uZenith.value.set(cfg.sky.zenithColor);
  skyUniforms.uMid.value.set(cfg.sky.midColor);
  skyUniforms.uHorizon.value.set(cfg.sky.horizonColor);
  skyUniforms.uSunColor.value.set(cfg.sky.sunColor);
  skyUniforms.uSunGlow.value.set(cfg.sky.sunGlowColor);
  skyUniforms.uShowSun.value = cfg.sky.showSunDisc ? 1.0 : 0.0;

  const elev = cfg.sky.sunElevation;
  const azim = cfg.sky.sunAzimuth;
  const sunDir = new THREE.Vector3(
    Math.cos(elev) * Math.cos(azim),
    Math.sin(elev),
    Math.cos(elev) * Math.sin(azim)
  ).normalize();
  skyUniforms.uSunDir.value.copy(sunDir);

  // Fog
  scene.fog = new THREE.FogExp2(cfg.fog.color, cfg.fog.density);
  oceanUniforms.uFogColor.value.set(cfg.fog.color);
  oceanUniforms.uFogDensity.value = cfg.fog.density;

  // Lighting
  hemiLight.color.set(cfg.lighting.ambientSkyColor);
  hemiLight.groundColor.set(cfg.lighting.ambientGroundColor);
  hemiLight.intensity = cfg.lighting.ambientIntensity;

  sunLight.color.set(cfg.lighting.sunLightColor);
  sunLight.intensity = cfg.lighting.sunLightIntensity;
  sunLight.position.set(...cfg.lighting.sunPosition);

  rimLight.color.set(cfg.lighting.rimLightColor);
  rimLight.intensity = cfg.lighting.rimLightIntensity;
  renderer.toneMappingExposure = cfg.lighting.exposure;

  // Ocean
  oceanUniforms.uDeepColor.value.set(cfg.ocean.deepColor);
  oceanUniforms.uShallowColor.value.set(cfg.ocean.shallowColor);
  oceanUniforms.uSpecColor.value.set(cfg.ocean.specularColor);
  oceanUniforms.uShininess.value = cfg.ocean.shininess;
  oceanUniforms.uWaveHeight.value = cfg.ocean.waveHeight;
  oceanUniforms.uWaveSpeed.value = cfg.ocean.waveSpeed;
  oceanUniforms.uShimmer.value = cfg.ocean.goldenShimmerIntensity;
  oceanUniforms.uSunDir.value.copy(sunDir);

  // Lighthouse & Cottage
  lanternMat.emissive.set(cfg.lighthouse.lanternEmissive);
  lanternMat.emissiveIntensity = cfg.lighthouse.lanternIntensity;
  beamUniforms.uColor.value.set(cfg.lighthouse.beamColor);
  beamUniforms.uOpacity.value = cfg.lighthouse.beamOpacity * 1.45;
  windowMat.emissive.set(cfg.lighthouse.cottageWindowEmissive);
  windowMat.emissiveIntensity = cfg.lighthouse.cottageWindowIntensity;
  cottagePointLight.intensity = cfg.lighthouse.cottageWindowIntensity * 1.1;

  // Fireflies
  const count = cfg.fireflies.enabled ? Math.min(cfg.fireflies.count, MAX_FIREFLIES) : 0;
  fireflyGeo.setDrawRange(0, count);
  fireflyMat.size = cfg.fireflies.size;
  fireflyPoints.visible = count > 0;
  const c1 = new THREE.Color(cfg.fireflies.primaryColor);
  const c2 = new THREE.Color(cfg.fireflies.secondaryColor);
  for (let i = 0; i < MAX_FIREFLIES; i++) {
    const c = i % 3 === 0 ? c2 : c1;
    ffColors[i * 3] = c.r;
    ffColors[i * 3 + 1] = c.g;
    ffColors[i * 3 + 2] = c.b;
  }
  fireflyGeo.attributes.color.needsUpdate = true;
}

applySceneConfig(activeConfig);

// Manual preview buttons & keyboard shortcuts
btnV1.addEventListener("click", () => applySceneConfig(V1_PRESET));
btnV2.addEventListener("click", () => applySceneConfig(V2_PRESET));
window.addEventListener("keydown", (e) => {
  if (e.key === "h" || e.key === "H") hudEl.classList.toggle("is-hidden");
  if (e.key === "1") applySceneConfig(V1_PRESET);
  if (e.key === "2") applySceneConfig(V2_PRESET);
});

// Auto-poll scene-config.js so Codex CLI edits hot-update even under python3 -m http.server!
let lastConfigText = null;
setInterval(async () => {
  try {
    const res = await fetch(`./scene-config.js?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return;
    const txt = await res.text();
    if (lastConfigText === null) {
      lastConfigText = txt;
      return;
    }
    if (txt !== lastConfigText) {
      lastConfigText = txt;
      const blobUrl = URL.createObjectURL(new Blob([txt], { type: "text/javascript" }));
      try {
        const mod = await import(blobUrl);
        if (mod && mod.SCENE_CONFIG) {
          applySceneConfig(mod.SCENE_CONFIG);
        } else {
          window.location.reload();
        }
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    }
  } catch (_) {
    // Ignore transient save errors while editor writes file
  }
}, 850);

// --- 7. Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  oceanUniforms.uTime.value = t;
  islandGroup.position.y = Math.sin(t * 0.85) * 0.12;
  beamPivot.rotation.y = t * (activeConfig.lighthouse?.beamSpeed ?? 0.75);

  // Gently bob sailboat
  boatGroup.position.y = 0.22 + Math.sin(t * 1.6) * 0.1;
  boatGroup.rotation.z = Math.sin(t * 1.3) * 0.08;

  // Drift fireflies
  if (fireflyPoints.visible) {
    const pos = fireflyGeo.attributes.position.array;
    const count = fireflyGeo.drawRange.count;
    for (let i = 0; i < count; i++) {
      const baseAngle = ffSeeds[i * 4];
      const radius = ffSeeds[i * 4 + 1];
      const baseY = ffSeeds[i * 4 + 2];
      const phase = ffSeeds[i * 4 + 3];
      const a = baseAngle + Math.sin(t * 0.35 + phase) * 0.35;
      const r = radius + Math.cos(t * 0.5 + phase) * 0.45;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = baseY + Math.sin(t * 1.15 + phase) * 0.55;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    fireflyGeo.attributes.position.needsUpdate = true;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
