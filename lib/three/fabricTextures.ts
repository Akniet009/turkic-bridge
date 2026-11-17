import * as THREE from 'three';

export type FabricWeaveId = 'linen' | 'velvet' | 'boucle' | 'jacquard' | 'satin';

export interface FabricPreset {
  id: FabricWeaveId;
  nameRu: string;
  nameTr: string;
  composition: string;
  gsm: number;
  martindale: string;
  roughness: number;
  metalness: number;
  sheen: number;
  bumpScale: number;
  repeat: number;
}

export const FABRIC_PRESETS: FabricPreset[] = [
  {
    id: 'linen',
    nameRu: 'Рогожка / Лён',
    nameTr: 'Keten Dokuma',
    composition: '70% хлопок, 30% лён',
    gsm: 420,
    martindale: '45 000 циклов',
    roughness: 0.88,
    metalness: 0.02,
    sheen: 0.15,
    bumpScale: 0.035,
    repeat: 7,
  },
  {
    id: 'velvet',
    nameRu: 'Турецкий бархат',
    nameTr: 'Bursa Kadife',
    composition: '100% микро-хлопок / полиэстер',
    gsm: 380,
    martindale: '60 000 циклов',
    roughness: 0.62,
    metalness: 0.05,
    sheen: 0.85,
    bumpScale: 0.015,
    repeat: 8,
  },
  {
    id: 'boucle',
    nameRu: 'Букле премиум',
    nameTr: 'Buklet Kumaş',
    composition: '65% шерсть/хлопок, 35% акрил',
    gsm: 540,
    martindale: '50 000 циклов',
    roughness: 0.95,
    metalness: 0.0,
    sheen: 0.1,
    bumpScale: 0.06,
    repeat: 6,
  },
  {
    id: 'jacquard',
    nameRu: 'Жаккард Бурса',
    nameTr: 'Bursa Jakar',
    composition: '60% вискоза, 40% хлопок',
    gsm: 460,
    martindale: '40 000 циклов',
    roughness: 0.55,
    metalness: 0.08,
    sheen: 0.55,
    bumpScale: 0.03,
    repeat: 5,
  },
  {
    id: 'satin',
    nameRu: 'Сатин-страйп',
    nameTr: 'Saten Dokuma',
    composition: '100% длинноволокнистый хлопок',
    gsm: 280,
    martindale: '35 000 циклов',
    roughness: 0.38,
    metalness: 0.06,
    sheen: 0.65,
    bumpScale: 0.012,
    repeat: 6,
  },
];

export interface FabricColor {
  id: string;
  nameRu: string;
  hex: string;
  accentHex: string;
}

export const FABRIC_COLORS: FabricColor[] = [
  { id: 'ecru', nameRu: 'Молочный экру', hex: '#EAE4D7', accentHex: '#9A8C78' },
  { id: 'sand', nameRu: 'Тёплый песок', hex: '#C8B49A', accentHex: '#6F5E4D' },
  { id: 'emerald', nameRu: 'Изумрудный', hex: '#28524B', accentHex: '#D8CFC0' },
  { id: 'teal', nameRu: 'Морская волна', hex: '#1E5F6E', accentHex: '#E8DFD1' },
  { id: 'terracotta', nameRu: 'Терракота', hex: '#A95C42', accentHex: '#EBDCCB' },
  { id: 'slate', nameRu: 'Графит', hex: '#3B424C', accentHex: '#C5CBD3' },
  { id: 'powder', nameRu: 'Пыльная роза', hex: '#C7A29E', accentHex: '#5D4D4B' },
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

function clamp(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/**
 * Generates procedural diffuse and bump textures for realistic fabric weaves.
 */
export function createFabricTextures(
  weave: FabricWeaveId,
  baseHex: string,
  repeat = 6
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  const base = hexToRgb(baseHex);
  const cImg = cCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  // Deterministic pseudo-random helper
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let shade = 0; // -1 to 1
      let height = 128; // 0 to 255

      if (weave === 'linen') {
        // Basketweave warp & weft threads
        const cellX = Math.floor(x / 4);
        const cellY = Math.floor(y / 4);
        const inX = (x % 4) / 4;
        const inY = (y % 4) / 4;
        const isWarp = (cellX + cellY) % 2 === 0;
        const threadProfile = isWarp
          ? Math.sin(inX * Math.PI)
          : Math.sin(inY * Math.PI);
        const noise = (hash(x, y) - 0.5) * 0.18;
        shade = (threadProfile - 0.5) * 0.22 + noise;
        height = clamp(90 + threadProfile * 135 + noise * 40);
      } else if (weave === 'velvet') {
        // Soft directional micro-fibers
        const fiber = Math.sin(x * 0.45 + hash(Math.floor(x / 2), Math.floor(y / 6)) * 2.0);
        const micro = (hash(x, y) - 0.5) * 0.14;
        shade = fiber * 0.06 + micro;
        height = clamp(120 + fiber * 30 + micro * 60);
      } else if (weave === 'boucle') {
        // Looped knobby yarn clusters
        const gx = Math.floor(x / 6);
        const gy = Math.floor(y / 6);
        const cx = (x % 6) - 3;
        const cy = (y % 6) - 3;
        const dist = Math.sqrt(cx * cx + cy * cy) / 4.2;
        const loop = Math.max(0, 1 - dist);
        const j = hash(gx, gy);
        const ring = Math.sin(dist * Math.PI * 1.4) * (0.5 + j * 0.5);
        const micro = (hash(x, y) - 0.5) * 0.2;
        shade = (loop * 0.25 - 0.1) + ring * 0.12 + micro;
        height = clamp(60 + loop * 170 + ring * 40);
      } else if (weave === 'jacquard') {
        // Geometric Ottoman diamond damask motif
        const u = (x / size) * Math.PI * 8;
        const v = (y / size) * Math.PI * 8;
        const diamond = Math.abs(Math.sin(u) * Math.cos(v) + Math.cos(u) * Math.sin(v));
        const fineWeave = ((x + y) % 3 === 0 ? 0.08 : -0.04);
        const motif = diamond > 0.55 ? 0.18 : -0.08;
        shade = motif + fineWeave;
        height = clamp(110 + motif * 280 + fineWeave * 120);
      } else {
        // Satin stripe weave
        const stripe = Math.floor(x / 16) % 2 === 0 ? 0.09 : -0.05;
        const sheenLine = Math.sin((y / size) * Math.PI * 16) * 0.03;
        const micro = (hash(x, y) - 0.5) * 0.04;
        shade = stripe + sheenLine + micro;
        height = clamp(128 + stripe * 180 + micro * 40);
      }

      const factor = 1 + shade;
      cImg.data[idx] = clamp(base.r * factor);
      cImg.data[idx + 1] = clamp(base.g * factor);
      cImg.data[idx + 2] = clamp(base.b * factor);
      cImg.data[idx + 3] = 255;

      bImg.data[idx] = height;
      bImg.data[idx + 1] = height;
      bImg.data[idx + 2] = height;
      bImg.data[idx + 3] = 255;
    }
  }

  cCtx.putImageData(cImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeat, repeat);
  map.colorSpace = THREE.SRGBColorSpace;
  map.needsUpdate = true;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(repeat, repeat);
  bumpMap.needsUpdate = true;

  return { map, bumpMap };
}
