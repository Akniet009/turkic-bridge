import * as THREE from 'three';

export type FabricWeaveId =
  | 'ranforce'
  | 'stripe_satin'
  | 'terry'
  | 'waffle'
  | 'jacquard'
  | 'linen'
  | 'tartan'
  | 'velvet_sherpa';

export interface FabricPreset {
  id: FabricWeaveId;
  nameRu: string;
  nameTr: string;
  composition: string;
  gsm: number;
  martindale: string;
  roughness: number;
  sheen: number;
  sheenRoughness: number;
  normalScale: number;
  repeat: number;
}

export const FABRIC_PRESETS: FabricPreset[] = [
  {
    id: 'ranforce',
    nameRu: 'Эгейский Ранфорс',
    nameTr: 'Ege Ranforce Pamuk',
    composition: '100% эгейский хлопок (57 нитей/см²)',
    gsm: 145,
    martindale: '35 000 циклов',
    roughness: 0.85,
    sheen: 0.25,
    sheenRoughness: 0.7,
    normalScale: 0.85,
    repeat: 8,
  },
  {
    id: 'stripe_satin',
    nameRu: 'Страйп-сатин 300TC',
    nameTr: 'Çizgili Otel Sateni',
    composition: '100% длинноволокнистый хлопок 300TC',
    gsm: 140,
    martindale: '40 000 циклов',
    roughness: 0.42,
    sheen: 0.72,
    sheenRoughness: 0.35,
    normalScale: 0.7,
    repeat: 5,
  },
  {
    id: 'terry',
    nameRu: 'Махра Денизли (Букле)',
    nameTr: 'Denizli Bukle Havlu',
    composition: '100% крученый хлопок Ring Spun',
    gsm: 600,
    martindale: '55 000 циклов',
    roughness: 0.96,
    sheen: 0.35,
    sheenRoughness: 0.85,
    normalScale: 1.45,
    repeat: 7,
  },
  {
    id: 'waffle',
    nameRu: 'Вафельный хлопок',
    nameTr: 'Waffle Pike Dokuma',
    composition: '100% хлопок Stonewashed',
    gsm: 320,
    martindale: '42 000 циклов',
    roughness: 0.9,
    sheen: 0.2,
    sheenRoughness: 0.8,
    normalScale: 1.55,
    repeat: 6,
  },
  {
    id: 'jacquard',
    nameRu: 'Жаккард Бурса',
    nameTr: 'Bursa Jakarlı Saten',
    composition: '60% вискоза, 40% мако-хлопок',
    gsm: 460,
    martindale: '45 000 циклов',
    roughness: 0.52,
    sheen: 0.65,
    sheenRoughness: 0.42,
    normalScale: 1.15,
    repeat: 4,
  },
  {
    id: 'linen',
    nameRu: 'Вареный лен / Рогожка',
    nameTr: 'Yıkanmış Keten',
    composition: '50% лен, 50% анатолийский хлопок',
    gsm: 420,
    martindale: '50 000 циклов',
    roughness: 0.92,
    sheen: 0.2,
    sheenRoughness: 0.85,
    normalScale: 1.2,
    repeat: 7,
  },
  {
    id: 'tartan',
    nameRu: 'Шерсть Таpтан (Клетка)',
    nameTr: 'Yün İskoç Ekose',
    composition: '70% анатолийская шерсть, 30% акрил',
    gsm: 400,
    martindale: '48 000 циклов',
    roughness: 0.94,
    sheen: 0.3,
    sheenRoughness: 0.82,
    normalScale: 1.0,
    repeat: 3,
  },
  {
    id: 'velvet_sherpa',
    nameRu: 'Велюр / Шерпа Люкс',
    nameTr: 'Kadife & Sherpa',
    composition: '100% микро-велюр высокой плотности',
    gsm: 460,
    martindale: '65 000 циклов',
    roughness: 0.68,
    sheen: 0.95,
    sheenRoughness: 0.45,
    normalScale: 0.75,
    repeat: 7,
  },
];

export interface FabricColor {
  id: string;
  nameRu: string;
  hex: string;
  accentHex: string;
}

export const FABRIC_COLORS: FabricColor[] = [
  { id: 'ivory', nameRu: 'Слоновая кость', hex: '#F0ECE1', accentHex: '#A79986' },
  { id: 'sand', nameRu: 'Тёплый песок', hex: '#D1BEA5', accentHex: '#7A6855' },
  { id: 'sage', nameRu: 'Оливковый шалфей', hex: '#7A8C7D', accentHex: '#E9E5DC' },
  { id: 'emerald', nameRu: 'Изумрудный', hex: '#264E47', accentHex: '#DED6C8' },
  { id: 'ocean', nameRu: 'Глубокий синий', hex: '#1E3F5A', accentHex: '#E5DFD5' },
  { id: 'terracotta', nameRu: 'Терракота', hex: '#A45B43', accentHex: '#EFE4D6' },
  { id: 'graphite', nameRu: 'Графит', hex: '#3D444E', accentHex: '#CBD1D9' },
  { id: 'blush', nameRu: 'Пудровый беж', hex: '#CCA9A3', accentHex: '#635350' },
];

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function clamp(v: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function mixRgb(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) {
  return {
    r: a.r * (1 - t) + b.r * t,
    g: a.g * (1 - t) + b.g * t,
    b: a.b * (1 - t) + b.b * t,
  };
}

/**
 * Generates high-resolution 512x512 procedural PBR maps:
 * - map (Albedo diffuse texture)
 * - normalMap (Tangent-space normal map derived from height field via Sobel gradients)
 * - roughnessMap (Micro-roughness variation so sheen & threads react differently to studio light)
 */
export function createFabricTextures(
  weave: FabricWeaveId,
  baseHex: string,
  repeat = 6
): {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 512;
  const heightField = new Float32Array(size * size);
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;
  const cImg = cCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  const rImg = rCtx.createImageData(size, size);

  const base = hexToRgb(baseHex);
  const darkBase = { r: base.r * 0.62, g: base.g * 0.62, b: base.b * 0.62 };
  const lightBase = { r: Math.min(255, base.r * 1.15 + 18), g: Math.min(255, base.g * 1.15 + 18), b: Math.min(255, base.b * 1.15 + 18) };

  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const idx = i * 4;
      let h = 0.5;
      let shade = 0;
      let roughVal = 200;
      let pixelRgb = { ...base };

      if (weave === 'ranforce' || weave === 'linen') {
        // Fine warp/weft thread weave + subtle natural fiber slubs
        const step = weave === 'ranforce' ? 4 : 6;
        const cx = Math.floor(x / step);
        const cy = Math.floor(y / step);
        const ux = (x % step) / step;
        const uy = (y % step) / step;
        const warp = (cx + cy) % 2 === 0;
        const profile = warp ? Math.sin(ux * Math.PI) : Math.sin(uy * Math.PI);
        const cross = warp ? Math.sin(uy * Math.PI) * 0.35 : Math.sin(ux * Math.PI) * 0.35;
        const slub = weave === 'linen' ? (hash(Math.floor(x / 18), cy) - 0.5) * 0.25 : 0;
        const grain = (hash(x, y) - 0.5) * 0.08;
        h = 0.25 + profile * 0.5 + cross * 0.2 + slub * 0.15;
        shade = (profile - 0.5) * 0.18 + slub * 0.2 + grain;
        roughVal = clamp(210 - profile * 30);
      } else if (weave === 'stripe_satin') {
        // Crisp 1cm alternating matte/gloss satin stripe weave
        const stripeWidth = 32;
        const stripeIndex = Math.floor(x / stripeWidth);
        const isGlossStripe = stripeIndex % 2 === 0;
        const edgeDist = Math.min(x % stripeWidth, stripeWidth - (x % stripeWidth));
        const edgeBevel = edgeDist < 2 ? -0.15 : 0;
        const microThread = isGlossStripe
          ? Math.sin((y / size) * Math.PI * 128) * 0.04
          : Math.sin((x / size) * Math.PI * 128) * 0.04;
        h = 0.5 + (isGlossStripe ? 0.08 : -0.05) + edgeBevel * 0.4 + microThread;
        shade = (isGlossStripe ? 0.09 : -0.04) + edgeBevel * 0.15 + (hash(x, y) - 0.5) * 0.03;
        roughVal = isGlossStripe ? 85 : 155;
      } else if (weave === 'terry') {
        // Dense curled cotton terry towel loops
        const cell = 8;
        const gx = Math.floor(x / cell);
        const gy = Math.floor(y / cell);
        const ox = (hash(gx, gy) - 0.5) * 2.5;
        const oy = (hash(gx + 13, gy + 7) - 0.5) * 2.5;
        const dx = (x % cell) - cell / 2 + ox;
        const dy = (y % cell) - cell / 2 + oy;
        const r = Math.sqrt(dx * dx + dy * dy) / (cell * 0.62);
        const loop = Math.max(0, 1 - r);
        const ring = Math.sin(r * Math.PI * 1.6);
        const micro = (hash(x, y) - 0.5) * 0.14;
        h = 0.15 + loop * 0.68 + ring * 0.12 + micro * 0.1;
        shade = (loop - 0.45) * 0.28 + ring * 0.08 + micro * 0.3;
        roughVal = clamp(235 - loop * 30);
      } else if (weave === 'waffle') {
        // Deep 3D honeycomb waffle pockets
        const cell = 32;
        const lx = (x % cell) / cell - 0.5;
        const ly = (y % cell) / cell - 0.5;
        const diamond = Math.abs(lx) + Math.abs(ly); // 0 center, 1 corners
        const ridge = Math.pow(Math.min(1, diamond * 1.45), 1.8);
        const fineThread = ((x + y) % 4 === 0 ? 0.05 : -0.03);
        h = 0.1 + ridge * 0.85 + fineThread;
        shade = (ridge - 0.5) * 0.34 + fineThread * 0.4 + (hash(x, y) - 0.5) * 0.04;
        roughVal = clamp(230 - ridge * 35);
      } else if (weave === 'jacquard') {
        // Luxury Ottoman damask / geometric jacquard motif
        const u = (x / size) * Math.PI * 6;
        const v = (y / size) * Math.PI * 6;
        const medallion = Math.cos(u) * Math.cos(v) + 0.5 * Math.cos(2 * u) + 0.5 * Math.cos(2 * v);
        const borderDiamond = Math.abs(Math.sin(u * 0.5 + v * 0.5)) * Math.abs(Math.sin(u * 0.5 - v * 0.5));
        const pattern = medallion * 0.5 + borderDiamond * 0.6;
        const isRaised = pattern > 0.38;
        const twill = ((x + y) % 3 === 0 ? 0.05 : -0.03);
        h = (isRaised ? 0.72 : 0.32) + pattern * 0.15 + twill;
        shade = (isRaised ? 0.14 : -0.08) + twill * 0.5;
        roughVal = isRaised ? 105 : 195;
      } else if (weave === 'tartan') {
        // Authentic woven Scottish tartan plaid in yarn threads
        const px = x / size;
        const py = y / size;
        const stripeX =
          (Math.abs(px - 0.25) < 0.045 || Math.abs(px - 0.75) < 0.045 ? 1 : 0) +
          (Math.abs(px - 0.5) < 0.018 ? 2 : 0);
        const stripeY =
          (Math.abs(py - 0.25) < 0.045 || Math.abs(py - 0.75) < 0.045 ? 1 : 0) +
          (Math.abs(py - 0.5) < 0.018 ? 2 : 0);
        const twillX = (x + y) % 6 < 3;
        const threadVal = twillX ? 0.62 : 0.42;
        if (stripeX === 2 || stripeY === 2) {
          pixelRgb = mixRgb(base, { r: 225, g: 215, b: 195 }, 0.72);
        } else if (stripeX === 1 && stripeY === 1) {
          pixelRgb = darkBase;
        } else if (stripeX === 1 || stripeY === 1) {
          pixelRgb = mixRgb(base, darkBase, 0.55);
        }
        h = threadVal + (hash(x, y) - 0.5) * 0.12;
        shade = (threadVal - 0.5) * 0.18 + (hash(x, y) - 0.5) * 0.06;
        roughVal = 225;
      } else {
        // velvet_sherpa: luxurious soft micro-nap
        const wave = Math.sin(x * 0.05 + Math.cos(y * 0.04) * 2.5) * 0.12;
        const nap = (hash(Math.floor(x / 2), Math.floor(y / 2)) - 0.5) * 0.15;
        h = 0.5 + wave + nap;
        shade = wave * 0.4 + nap * 0.25;
        roughVal = clamp(150 + wave * 60);
      }

      heightField[i] = Math.max(0, Math.min(1, h));

      const factor = 1 + shade;
      const targetRgb = shade > 0.12 ? mixRgb(pixelRgb, lightBase, 0.2) : pixelRgb;
      cImg.data[idx] = clamp(targetRgb.r * factor);
      cImg.data[idx + 1] = clamp(targetRgb.g * factor);
      cImg.data[idx + 2] = clamp(targetRgb.b * factor);
      cImg.data[idx + 3] = 255;

      rImg.data[idx] = roughVal;
      rImg.data[idx + 1] = roughVal;
      rImg.data[idx + 2] = roughVal;
      rImg.data[idx + 3] = 255;
    }
  }

  // Build Tangent-Space Normal Map from heightField gradients
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const nCtx = normalCanvas.getContext('2d')!;
  const nImg = nCtx.createImageData(size, size);
  const strength = 3.2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const ym = (y - 1 + size) % size;
      const yp = (y + 1) % size;

      const dX = (heightField[y * size + xp] - heightField[y * size + xm]) * strength;
      const dY = (heightField[yp * size + x] - heightField[ym * size + x]) * strength;

      let nx = -dX;
      let ny = -dY;
      let nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * size + x) * 4;
      nImg.data[idx] = clamp((nx * 0.5 + 0.5) * 255);
      nImg.data[idx + 1] = clamp((ny * 0.5 + 0.5) * 255);
      nImg.data[idx + 2] = clamp((nz * 0.5 + 0.5) * 255);
      nImg.data[idx + 3] = 255;
    }
  }

  cCtx.putImageData(cImg, 0, 0);
  nCtx.putImageData(nImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeat, repeat);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(repeat, repeat);
  normalMap.anisotropy = 8;
  normalMap.needsUpdate = true;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeat, repeat);
  roughnessMap.needsUpdate = true;

  return { map, normalMap, roughnessMap };
}

/**
 * Generates realistic warm oak wood grain texture for sofa/chair/bed frames and spa benches.
 */
export function createWoodTextures(): { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } {
  const size = 256;
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const ctx = cCanvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;
  const rImg = rCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const grain =
        Math.sin(x * 0.14 + Math.sin(y * 0.04) * 3.5) * 0.5 +
        Math.sin(x * 0.38 + y * 0.01) * 0.25;
      const pore = Math.sin(x * 1.4 + y * 0.3) * 0.08;
      const t = (grain + pore) * 0.16;

      const idx = (y * size + x) * 4;
      img.data[idx] = clamp(122 * (1 + t));
      img.data[idx + 1] = clamp(86 * (1 + t));
      img.data[idx + 2] = clamp(56 * (1 + t));
      img.data[idx + 3] = 255;

      const rv = clamp(145 - grain * 30);
      rImg.data[idx] = rv;
      rImg.data[idx + 1] = rv;
      rImg.data[idx + 2] = rv;
      rImg.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const map = new THREE.CanvasTexture(cCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  map.needsUpdate = true;

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.needsUpdate = true;

  return { map, roughnessMap };
}
