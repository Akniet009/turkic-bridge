import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { createWoodTextures } from './fabricTextures';

export type ModelTypeId = 'sofa' | 'chair' | 'bed' | 'towels' | 'drape';

export interface ModelMeta {
  id: ModelTypeId;
  nameRu: string;
  subtitleRu: string;
  defaultCamera: [number, number, number];
  target: [number, number, number];
}

export const MODEL_TYPES: ModelMeta[] = [
  {
    id: 'sofa',
    nameRu: 'Диван с пледом',
    subtitleRu: '3-местный диван с кантом, подушками и драпированным пледом',
    defaultCamera: [2.5, 1.55, 2.75],
    target: [0, 0.44, 0],
  },
  {
    id: 'chair',
    nameRu: 'Кресло',
    subtitleRu: 'Дизайнерское кресло со стяжкой и поясничной подушкой',
    defaultCamera: [1.65, 1.25, 1.85],
    target: [0, 0.46, 0],
  },
  {
    id: 'bed',
    nameRu: 'Кровать с бельём',
    subtitleRu: 'Гостиничный комплект: изголовье, пухлое одеяло, раннер и подушки',
    defaultCamera: [2.65, 1.75, 2.85],
    target: [0, 0.52, 0],
  },
  {
    id: 'towels',
    nameRu: 'Полотенца на скамье',
    subtitleRu: 'Стопка сложенных махровых полотенец с бордюром и роллы на дубовой скамье',
    defaultCamera: [1.35, 0.95, 1.45],
    target: [0, 0.36, 0],
  },
  {
    id: 'drape',
    nameRu: 'Драпировка и рулон',
    subtitleRu: 'Архитектурная драпировка полотна и оптовый рулон ткани',
    defaultCamera: [1.95, 1.28, 2.25],
    target: [0, 0.88, 0],
  },
];

function createWoodMaterial() {
  const tex = createWoodTextures();
  return new THREE.MeshStandardMaterial({
    map: tex.map,
    roughnessMap: tex.roughnessMap,
    roughness: 0.52,
    metalness: 0.04,
  });
}

function createBrassMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#CFA958'),
    roughness: 0.24,
    metalness: 0.88,
  });
}

function createWhiteLinenMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F7F5F0'),
    roughness: 0.78,
    metalness: 0.02,
  });
}

function tagFabric(mesh: THREE.Mesh, role: 'primary' | 'accent' = 'primary') {
  mesh.userData.fabricRole = role;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Deforms a subdivided BoxGeometry into a soft, plump upholstered cushion or pillow
 * with natural rounded crown bulge and slightly pinched stitched edges.
 */
function createPlumpCushionGeometry(
  w: number,
  h: number,
  d: number,
  bulge = 0.032,
  pinch = 0.015,
  segs = 18
): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(w, h, d, segs, Math.max(8, Math.floor(segs / 2)), segs);
  const pos = geo.attributes.position;
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const nx = x / hw; // -1..1
    const ny = y / hh; // -1..1
    const nz = z / hd; // -1..1

    // Smooth dome inflation toward center of each face
    const r2 = Math.min(1, nx * nx * 0.65 + nz * nz * 0.65);
    const dome = Math.cos(r2 * Math.PI * 0.5);

    // Round off corners smoothly
    const edgeRound = Math.sqrt(Math.max(0.01, (1 - 0.16 * nx * nx) * (1 - 0.16 * nz * nz)));
    y *= edgeRound;

    // Add soft crown puff on top and bottom
    y += Math.sign(y) * dome * bulge * (0.4 + 0.6 * Math.abs(ny));

    // Slight tuck along lateral edges for tailored upholstery look
    const seamTuck = (1 - Math.abs(ny)) * pinch;
    x -= Math.sign(x) * seamTuck * Math.abs(nx);
    z -= Math.sign(z) * seamTuck * Math.abs(nz);

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Adds tailored piping/welt seam along a rectangular cushion perimeter.
 */
function createPipingFrame(
  w: number,
  d: number,
  radius: number,
  mat: THREE.Material
): THREE.Mesh {
  const hw = w / 2 - 0.012;
  const hd = d / 2 - 0.012;
  const r = 0.04;
  const pts: THREE.Vector3[] = [];
  const corners: [number, number, number][] = [
    [hw - r, -hd + r, -Math.PI / 2],
    [hw - r, hd - r, 0],
    [-hw + r, hd - r, Math.PI / 2],
    [-hw + r, -hd + r, Math.PI],
  ];
  corners.forEach(([cx, cz, startA]) => {
    for (let s = 0; s <= 5; s++) {
      const a = startA + (s / 5) * (Math.PI / 2);
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r));
    }
  });
  const curve = new THREE.CatmullRomCurve3(pts, true);
  const geo = new THREE.TubeGeometry(curve, 64, radius, 8, true);
  return tagFabric(new THREE.Mesh(geo, mat), 'accent');
}

function createTaperedLeg(
  height: number,
  topR: number,
  botR: number,
  woodMat: THREE.Material,
  brassMat: THREE.Material
) {
  const legGroup = new THREE.Group();
  const woodGeo = new THREE.CylinderGeometry(topR, botR, height * 0.82, 24);
  const woodMesh = new THREE.Mesh(woodGeo, woodMat);
  woodMesh.position.y = height * 0.5 + height * 0.09;
  woodMesh.castShadow = true;
  legGroup.add(woodMesh);

  const ferruleGeo = new THREE.CylinderGeometry(botR * 1.02, botR * 0.9, height * 0.18, 24);
  const ferruleMesh = new THREE.Mesh(ferruleGeo, brassMat);
  ferruleMesh.position.y = height * 0.09;
  ferruleMesh.castShadow = true;
  legGroup.add(ferruleMesh);

  return legGroup;
}

/**
 * 1. High-detail 3-Seater Sofa with oak grain base, brass ferrules,
 * 3 plump sculpted seat cushions with piping seams, tufted backrest cushions,
 * throw pillows, and a rippled draped throw blanket.
 */
export function buildSofaModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();

  // 4 Tapered Oak Legs + Brass Tips
  const legPositions: [number, number, number][] = [
    [-1.1, 0, 0.38],
    [1.1, 0, 0.38],
    [-1.1, 0, -0.38],
    [1.1, 0, -0.38],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = createTaperedLeg(0.2, 0.032, 0.019, woodMat, brassMat);
    leg.position.set(x, y, z);
    leg.rotation.z = x < 0 ? 0.09 : -0.09;
    leg.rotation.x = z > 0 ? 0.09 : -0.09;
    group.add(leg);
  });

  // Oak plinth base
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(2.44, 0.065, 0.94, 5, 0.02), woodMat);
  plinth.position.set(0, 0.22, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Upholstered Deck
  const deck = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(2.38, 0.15, 0.9, 6, 0.04), primaryMat),
    'primary'
  );
  deck.position.set(0, 0.32, 0);
  group.add(deck);

  // 3 Sculpted Plump Seat Cushions with Top Piping
  [-0.72, 0, 0.72].forEach((x) => {
    const seatGeo = createPlumpCushionGeometry(0.7, 0.16, 0.75, 0.035, 0.015, 20);
    const seat = tagFabric(new THREE.Mesh(seatGeo, primaryMat), 'primary');
    seat.position.set(x, 0.47, 0.04);
    group.add(seat);

    const piping = createPipingFrame(0.68, 0.73, 0.008, accentMat);
    piping.position.set(x, 0.545, 0.04);
    group.add(piping);
  });

  // Backrest Frame
  const backFrame = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(2.42, 0.58, 0.18, 6, 0.055), primaryMat),
    'primary'
  );
  backFrame.position.set(0, 0.62, -0.38);
  group.add(backFrame);

  // 3 Angled Plump Back Cushions + Tufted Dimple Buttons
  [-0.72, 0, 0.72].forEach((x) => {
    const backGeo = createPlumpCushionGeometry(0.69, 0.44, 0.18, 0.028, 0.012, 16);
    const backCushion = tagFabric(new THREE.Mesh(backGeo, primaryMat), 'primary');
    backCushion.position.set(x, 0.69, -0.22);
    backCushion.rotation.x = -0.16;
    group.add(backCushion);

    [-0.14, 0.14].forEach((bx) => {
      const btn = tagFabric(new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), accentMat), 'accent');
      btn.scale.set(1, 1, 0.45);
      btn.position.set(x + bx, 0.7, -0.12);
      group.add(btn);
    });
  });

  // Left & Right Tailored Armrests with front welt trim
  [-1.13, 1.13].forEach((x) => {
    const arm = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(0.18, 0.45, 0.92, 6, 0.065), primaryMat),
      'primary'
    );
    arm.position.set(x, 0.52, -0.01);
    group.add(arm);
  });

  // 2 Plush Accent Pillows (Rotated to look like throw pillows with center plumpness)
  const pillowGeo = createPlumpCushionGeometry(0.36, 0.34, 0.12, 0.032, 0.018, 16);
  const pillow1 = tagFabric(new THREE.Mesh(pillowGeo, accentMat), 'accent');
  pillow1.position.set(-0.84, 0.7, -0.02);
  pillow1.rotation.set(-0.24, 0.42, 0.14);
  group.add(pillow1);

  const pillow2 = tagFabric(new THREE.Mesh(pillowGeo, accentMat), 'accent');
  pillow2.position.set(0.84, 0.69, 0.01);
  pillow2.rotation.set(-0.2, -0.45, -0.12);
  group.add(pillow2);

  // Draped Throw Blanket over seat & front edge with realistic vertical ripples
  const blanketCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.42, 0.59, -0.14),
    new THREE.Vector3(0.58, 0.595, 0.14),
    new THREE.Vector3(0.68, 0.57, 0.38),
    new THREE.Vector3(0.71, 0.43, 0.445),
    new THREE.Vector3(0.69, 0.25, 0.455),
  ]);
  const width = 0.52;
  const segU = 32;
  const segV = 16;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segU; i++) {
    const t = i / segU;
    const pt = blanketCurve.getPoint(t);
    for (let j = 0; j <= segV; j++) {
      const s = j / segV - 0.5;
      const ripple = Math.sin(s * Math.PI * 5 + t * 4) * 0.01 * (0.4 + t * 0.6);
      positions.push(pt.x + s * width, pt.y + ripple, pt.z + ripple * 0.6);
      uvs.push(s + 0.5, t * 2.2);
    }
  }
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * (segV + 1) + j;
      const b = a + segV + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }
  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  ribbonGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  ribbonGeo.setIndex(indices);
  ribbonGeo.computeVertexNormals();

  const blanketMesh = tagFabric(new THREE.Mesh(ribbonGeo, accentMat), 'accent');
  group.add(blanketMesh);

  return group;
}

/**
 * 2. Sculpted Designer Lounge Armchair with diamond tufting, piped seat cushion,
 * curved wings, solid oak frame, and lumbar pillow.
 */
export function buildChairModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();

  const legs: [number, number, number, number][] = [
    [-0.36, 0.32, 0.14, 0.14],
    [0.36, 0.32, -0.14, 0.14],
    [-0.34, -0.32, 0.14, -0.14],
    [0.34, -0.32, -0.14, -0.14],
  ];
  legs.forEach(([x, z, rz, rx]) => {
    const leg = createTaperedLeg(0.3, 0.028, 0.017, woodMat, brassMat);
    leg.position.set(x, 0, z);
    leg.rotation.z = rz;
    leg.rotation.x = rx;
    group.add(leg);
  });

  const basePlate = new THREE.Mesh(new RoundedBoxGeometry(0.76, 0.05, 0.72, 4, 0.015), woodMat);
  basePlate.position.set(0, 0.3, 0);
  basePlate.castShadow = true;
  group.add(basePlate);

  const seatBase = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.12, 0.74, 6, 0.045), primaryMat),
    'primary'
  );
  seatBase.position.set(0, 0.37, 0);
  group.add(seatBase);

  // Sculpted Plump Seat Cushion + Piping
  const seatGeo = createPlumpCushionGeometry(0.66, 0.14, 0.64, 0.03, 0.012, 18);
  const cushion = tagFabric(new THREE.Mesh(seatGeo, primaryMat), 'primary');
  cushion.position.set(0, 0.48, 0.04);
  group.add(cushion);

  const piping = createPipingFrame(0.64, 0.62, 0.008, accentMat);
  piping.position.set(0, 0.545, 0.04);
  group.add(piping);

  // Curved Backrest + Side Wings
  const backGeo = createPlumpCushionGeometry(0.7, 0.56, 0.14, 0.025, 0.01, 16);
  const backCenter = tagFabric(new THREE.Mesh(backGeo, primaryMat), 'primary');
  backCenter.position.set(0, 0.7, -0.3);
  backCenter.rotation.x = -0.14;
  group.add(backCenter);

  [-0.36, 0.36].forEach((x, idx) => {
    const sideWing = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.47, 0.56, 6, 0.05), primaryMat),
      'primary'
    );
    sideWing.position.set(x, 0.62, -0.04);
    sideWing.rotation.y = idx === 0 ? -0.14 : 0.14;
    group.add(sideWing);
  });

  // 6 Tufted Diamond Buttons
  [-0.18, 0, 0.18].forEach((x) => {
    [0.64, 0.8].forEach((y) => {
      const btn = tagFabric(
        new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 12), accentMat),
        'accent'
      );
      btn.scale.set(1, 1, 0.45);
      btn.position.set(x, y, -0.22 - (y - 0.64) * 0.14);
      group.add(btn);
    });
  });

  // Accent Lumbar Pillow
  const lumbarGeo = createPlumpCushionGeometry(0.45, 0.25, 0.11, 0.028, 0.014, 14);
  const lumbar = tagFabric(new THREE.Mesh(lumbarGeo, accentMat), 'accent');
  lumbar.position.set(0, 0.62, -0.11);
  lumbar.rotation.x = -0.22;
  group.add(lumbar);

  return group;
}

/**
 * 3. Luxury Hotel Suite Bed with 5-channel tufted headboard, crisp sheet,
 * puffy folded duvet, runner, and 4 sculpted pillows.
 */
export function buildBedModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();
  const sheetMat = createWhiteLinenMaterial();

  [
    [-0.9, 0.95],
    [0.9, 0.95],
    [-0.9, -0.95],
    [0.9, -0.95],
  ].forEach(([x, z]) => {
    const leg = createTaperedLeg(0.16, 0.03, 0.02, woodMat, brassMat);
    leg.position.set(x, 0, z);
    group.add(leg);
  });

  // Upholstered Bed Frame + Wood Trim
  const frame = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(1.94, 0.24, 2.08, 5, 0.04), primaryMat),
    'primary'
  );
  frame.position.set(0, 0.26, 0);
  group.add(frame);

  // Oak surround on headboard
  const headBack = new THREE.Mesh(new RoundedBoxGeometry(2.04, 1.12, 0.08, 4, 0.02), woodMat);
  headBack.position.set(0, 0.73, -1.03);
  headBack.castShadow = true;
  group.add(headBack);

  // 7 Channel-tufted Soft Panels
  for (let i = -3; i <= 3; i++) {
    const x = i * 0.275;
    const chGeo = createPlumpCushionGeometry(0.265, 1.04, 0.1, 0.02, 0.008, 12);
    const channel = tagFabric(new THREE.Mesh(chGeo, primaryMat), 'primary');
    channel.position.set(x, 0.73, -0.97);
    group.add(channel);
  }

  // Crisp White Fitted Mattress
  const mattress = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.22, 1.94, 6, 0.05), sheetMat);
  mattress.position.set(0, 0.44, 0.03);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  group.add(mattress);

  // Folded Duvet with soft puffed center
  const duvetGeo = createPlumpCushionGeometry(1.88, 0.12, 1.4, 0.03, 0.015, 22);
  const duvet = tagFabric(new THREE.Mesh(duvetGeo, primaryMat), 'primary');
  duvet.position.set(0, 0.55, 0.31);
  group.add(duvet);

  // Turned-down top cuff of crisp white sheet / duvet fold
  const cuff = new THREE.Mesh(new RoundedBoxGeometry(1.86, 0.08, 0.22, 6, 0.035), sheetMat);
  cuff.position.set(0, 0.57, -0.34);
  cuff.castShadow = true;
  group.add(cuff);

  // Textured Bed Runner at Foot of Bed
  const runnerGeo = createPlumpCushionGeometry(1.92, 0.035, 0.48, 0.01, 0.004, 16);
  const runner = tagFabric(new THREE.Mesh(runnerGeo, accentMat), 'accent');
  runner.position.set(0, 0.62, 0.68);
  group.add(runner);

  // 2 Crisp White Sleeping Pillows
  const sleepGeo = createPlumpCushionGeometry(0.74, 0.14, 0.44, 0.038, 0.016, 16);
  [-0.44, 0.44].forEach((x) => {
    const p = new THREE.Mesh(sleepGeo, sheetMat);
    p.position.set(x, 0.62, -0.66);
    p.rotation.x = 0.28;
    p.castShadow = true;
    group.add(p);
  });

  // 2 Accent Throw Cushions
  const throwGeo = createPlumpCushionGeometry(0.48, 0.34, 0.13, 0.03, 0.015, 16);
  [-0.4, 0.4].forEach((x) => {
    const p = tagFabric(new THREE.Mesh(throwGeo, accentMat), 'accent');
    p.position.set(x, 0.69, -0.45);
    p.rotation.x = -0.25;
    group.add(p);
  });

  return group;
}

/**
 * 4. Dedicated Towel & Spa Bench Display (Slatted oak bench + stacked fluffy folded terry towels
 * with woven dobby border + rolled spa towels + brass ring bands).
 */
export function buildTowelsModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();
  const ceramicMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#EAE5DC'),
    roughness: 0.35,
    metalness: 0.05,
  });

  // Slatted Solid Oak Spa Bench
  [
    [-0.48, 0.2],
    [0.48, 0.2],
    [-0.48, -0.2],
    [0.48, -0.2],
  ].forEach(([x, z]) => {
    const leg = createTaperedLeg(0.26, 0.025, 0.018, woodMat, brassMat);
    leg.position.set(x, 0, z);
    group.add(leg);
  });

  // Bench Apron Frame
  const apron = new THREE.Mesh(new RoundedBoxGeometry(1.06, 0.035, 0.48, 4, 0.01), woodMat);
  apron.position.set(0, 0.26, 0);
  apron.castShadow = true;
  group.add(apron);

  // 5 Wood Slats on Bench Top
  for (let i = -2; i <= 2; i++) {
    const slat = new THREE.Mesh(new RoundedBoxGeometry(1.12, 0.025, 0.085, 4, 0.008), woodMat);
    slat.position.set(0, 0.29, i * 0.1);
    slat.castShadow = true;
    slat.receiveShadow = true;
    group.add(slat);
  }

  // Stack of 3 Plush Folded Terry Towels (Left Side)
  const towelW = 0.46;
  const towelH = 0.085;
  const towelD = 0.34;
  [0, 1, 2].forEach((tier) => {
    const y = 0.345 + tier * 0.082;
    const mat = tier === 1 ? accentMat : primaryMat;
    const role = tier === 1 ? 'accent' : 'primary';

    const foldedGeo = createPlumpCushionGeometry(towelW, towelH, towelD, 0.018, 0.006, 16);
    const towel = tagFabric(new THREE.Mesh(foldedGeo, mat), role);
    towel.position.set(-0.22, y, 0);
    towel.rotation.y = tier === 1 ? 0.04 : tier === 2 ? -0.03 : 0;
    group.add(towel);

    // Woven Dobby Border Band near front fold
    const dobby = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(towelW - 0.02, 0.012, 0.045, 4, 0.004), tier === 1 ? primaryMat : accentMat),
      tier === 1 ? 'primary' : 'accent'
    );
    dobby.position.set(-0.22, y + towelH / 2 + 0.006, 0.09);
    dobby.rotation.y = towel.rotation.y;
    group.add(dobby);
  });

  // 2 Rolled Spa Towels with Brass Ties (Right Front)
  [
    [0.24, 0.355, 0.09],
    [0.24, 0.355, -0.07],
  ].forEach(([x, y, z], idx) => {
    const roll = tagFabric(
      new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.34, 28), idx === 0 ? primaryMat : accentMat),
      idx === 0 ? 'primary' : 'accent'
    );
    roll.rotation.z = Math.PI / 2;
    roll.position.set(x, y, z);
    group.add(roll);

    // Inner spiral core shadow effect
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.344, 16),
      new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.9 })
    );
    hole.rotation.z = Math.PI / 2;
    hole.position.set(x, y, z);
    group.add(hole);

    // Brass tie band
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.005, 10, 28), brassMat);
    band.rotation.y = Math.PI / 2;
    band.position.set(x, y, z);
    group.add(band);
  });

  // Minimalist Ceramic Spa Bottle Accent (Right Back)
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.16, 24), ceramicMat);
  bottle.position.set(0.42, 0.38, -0.14);
  bottle.castShadow = true;
  group.add(bottle);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.04, 16), brassMat);
  neck.position.set(0.42, 0.47, -0.14);
  group.add(neck);

  return group;
}

/**
 * 5. Draped Curtain & Wholesale Fabric Roll Display
 */
export function buildDrapeModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const brassMat = createBrassMaterial();
  const woodMat = createWoodMaterial();

  const base = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.05, 0.7, 4, 0.015), woodMat);
  base.position.set(0, 0.025, 0);
  base.receiveShadow = true;
  group.add(base);

  [-0.75, 0.75].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.85, 16), brassMat);
    post.position.set(x, 0.95, -0.15);
    post.castShadow = true;
    group.add(post);
  });

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.66, 20), brassMat);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, 1.84, -0.15);
  rod.castShadow = true;
  group.add(rod);

  for (let i = -5; i <= 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.005, 10, 20), brassMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(i * 0.125, 1.84, -0.15);
    group.add(ring);
  }

  const segX = 68;
  const segY = 36;
  const width = 1.32;
  const height = 1.72;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= segY; iy++) {
    const v = iy / segY;
    const y = 0.1 + v * height;
    const flare = 1 + (1 - v) * 0.08;
    for (let ix = 0; ix <= segX; ix++) {
      const u = ix / segX;
      const x = (u - 0.5) * width * flare;
      const fold = Math.sin(u * Math.PI * 10) * (0.048 + (1 - v) * 0.032);
      const z = -0.15 + fold;
      positions.push(x, y, z);
      uvs.push(u * 2, v * 2.5);
    }
  }
  for (let iy = 0; iy < segY; iy++) {
    for (let ix = 0; ix < segX; ix++) {
      const a = iy * (segX + 1) + ix;
      const b = a + segX + 1;
      indices.push(a, a + 1, b);
      indices.push(b, a + 1, b + 1);
    }
  }
  const drapeGeo = new THREE.BufferGeometry();
  drapeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  drapeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  drapeGeo.setIndex(indices);
  drapeGeo.computeVertexNormals();

  const drapeMesh = tagFabric(new THREE.Mesh(drapeGeo, primaryMat), 'primary');
  group.add(drapeMesh);

  const roll = tagFabric(
    new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 32), accentMat),
    'accent'
  );
  roll.rotation.z = Math.PI / 2;
  roll.position.set(0, 0.19, 0.16);
  group.add(roll);

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 1.16, 20),
    new THREE.MeshStandardMaterial({ color: '#A38B70', roughness: 0.9 })
  );
  core.rotation.z = Math.PI / 2;
  core.position.set(0, 0.19, 0.16);
  group.add(core);

  return group;
}
