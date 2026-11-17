import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type ModelTypeId = 'sofa' | 'chair' | 'bed' | 'drape';

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
    nameRu: 'Диван',
    subtitleRu: '3-местный диван «Istanbul Loft» с пледом и подушками',
    defaultCamera: [2.7, 1.65, 3.0],
    target: [0, 0.45, 0],
  },
  {
    id: 'chair',
    nameRu: 'Кресло',
    subtitleRu: 'Дизайнерское кресло «Bursa Lounge» с каретной отстрочкой',
    defaultCamera: [1.8, 1.35, 2.0],
    target: [0, 0.45, 0],
  },
  {
    id: 'bed',
    nameRu: 'Кровать',
    subtitleRu: 'Гостиничный комплект «Denizli Suite» (изголовье + бельё)',
    defaultCamera: [2.9, 1.9, 3.1],
    target: [0, 0.5, 0],
  },
  {
    id: 'drape',
    nameRu: 'Драпировка',
    subtitleRu: 'Шторная драпировка и оптовый рулон ткани «Marmara»',
    defaultCamera: [2.1, 1.35, 2.5],
    target: [0, 0.9, 0],
  },
];

function createWoodMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6D4C33'),
    roughness: 0.48,
    metalness: 0.05,
  });
}

function createBrassMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C7A252'),
    roughness: 0.25,
    metalness: 0.85,
  });
}

function createWhiteLinenMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F5F3EE'),
    roughness: 0.72,
    metalness: 0.02,
  });
}

function tagFabric(mesh: THREE.Mesh, role: 'primary' | 'accent' = 'primary') {
  mesh.userData.fabricRole = role;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createTaperedLeg(
  height: number,
  topR: number,
  botR: number,
  woodMat: THREE.Material,
  brassMat: THREE.Material
) {
  const legGroup = new THREE.Group();
  const woodGeo = new THREE.CylinderGeometry(topR, botR, height * 0.82, 20);
  const woodMesh = new THREE.Mesh(woodGeo, woodMat);
  woodMesh.position.y = height * 0.5 + height * 0.09;
  woodMesh.castShadow = true;
  legGroup.add(woodMesh);

  const ferruleGeo = new THREE.CylinderGeometry(botR * 1.02, botR * 0.92, height * 0.18, 20);
  const ferruleMesh = new THREE.Mesh(ferruleGeo, brassMat);
  ferruleMesh.position.y = height * 0.09;
  ferruleMesh.castShadow = true;
  legGroup.add(ferruleMesh);

  return legGroup;
}

/**
 * 1. Detailed 3-Seater Sofa with wooden plinth, 3 rounded seat cushions,
 * tufted backrest cushions, armrests, throw pillows, and a draped blanket.
 */
export function buildSofaModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();

  // Legs (4 corner + 1 center support)
  const legPositions: [number, number, number][] = [
    [-1.12, 0, 0.38],
    [1.12, 0, 0.38],
    [-1.12, 0, -0.38],
    [1.12, 0, -0.38],
  ];
  legPositions.forEach(([x, y, z], i) => {
    const leg = createTaperedLeg(0.2, 0.032, 0.02, woodMat, brassMat);
    leg.position.set(x, y, z);
    leg.rotation.z = x < 0 ? 0.08 : -0.08;
    leg.rotation.x = z > 0 ? 0.08 : -0.08;
    group.add(leg);
  });

  // Solid oak base plinth
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(2.44, 0.07, 0.94, 4, 0.02), woodMat);
  plinth.position.set(0, 0.22, 0);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Upholstered lower deck
  const deck = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(2.38, 0.16, 0.9, 5, 0.04), primaryMat),
    'primary'
  );
  deck.position.set(0, 0.32, 0);
  group.add(deck);

  // 3 Plush Seat Cushions with subtle spacing
  const cushionW = 0.72;
  [-0.73, 0, 0.73].forEach((x) => {
    const seat = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(cushionW, 0.17, 0.76, 6, 0.06), primaryMat),
      'primary'
    );
    seat.position.set(x, 0.47, 0.04);
    group.add(seat);
  });

  // Backrest frame
  const backFrame = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(2.42, 0.56, 0.18, 5, 0.05), primaryMat),
    'primary'
  );
  backFrame.position.set(0, 0.62, -0.38);
  group.add(backFrame);

  // 3 Angled Backrest Cushions
  [-0.73, 0, 0.73].forEach((x) => {
    const backCushion = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(cushionW, 0.44, 0.19, 6, 0.07), primaryMat),
      'primary'
    );
    backCushion.position.set(x, 0.68, -0.22);
    backCushion.rotation.x = -0.15;
    group.add(backCushion);

    // Subtle tufted button indent accent
    const btn = tagFabric(
      new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), accentMat),
      'accent'
    );
    btn.scale.set(1, 1, 0.4);
    btn.position.set(x, 0.68, -0.125);
    group.add(btn);
  });

  // Left & Right Sculpted Armrests
  [-1.13, 1.13].forEach((x) => {
    const arm = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(0.18, 0.44, 0.92, 6, 0.06), primaryMat),
      'primary'
    );
    arm.position.set(x, 0.52, -0.01);
    group.add(arm);
  });

  // 2 Accent Throw Pillows
  const pillow1 = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.34, 0.13, 6, 0.055), accentMat),
    'accent'
  );
  pillow1.position.set(-0.84, 0.69, -0.02);
  pillow1.rotation.set(-0.22, 0.35, 0.12);
  group.add(pillow1);

  const pillow2 = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.32, 0.12, 6, 0.055), accentMat),
    'accent'
  );
  pillow2.position.set(0.86, 0.68, 0.0);
  pillow2.rotation.set(-0.2, -0.4, -0.1);
  group.add(pillow2);

  // Draped Throw Blanket over the right seat corner & front edge
  const blanketCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, 0.565, -0.12),
    new THREE.Vector3(0.65, 0.565, 0.15),
    new THREE.Vector3(0.75, 0.555, 0.41),
    new THREE.Vector3(0.78, 0.42, 0.46),
    new THREE.Vector3(0.76, 0.27, 0.465),
  ]);
  const blanketPoints = blanketCurve.getPoints(24);
  const blanketShape = new THREE.Shape();
  blanketShape.moveTo(-0.24, 0);
  blanketShape.lineTo(0.24, 0);
  blanketShape.lineTo(0.24, 0.018);
  blanketShape.lineTo(-0.24, 0.018);
  blanketShape.closePath();

  const blanketGeo = new THREE.ExtrudeGeometry(blanketShape, {
    steps: 28,
    bevelEnabled: false,
    extrudePath: blanketCurve,
  });
  // Rotate profile alignment cleanly via vertex normal or build simple ribbon mesh
  blanketGeo.dispose();

  // Custom curved ribbon mesh for blanket (clean UV mapping for fabric texture)
  const width = 0.48;
  const segU = 24;
  const segV = 8;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segU; i++) {
    const t = i / segU;
    const pt = blanketCurve.getPoint(t);
    for (let j = 0; j <= segV; j++) {
      const s = j / segV - 0.5;
      const wave = Math.sin(s * Math.PI * 3 + t * 5) * 0.008;
      positions.push(pt.x + s * width, pt.y + wave, pt.z);
      uvs.push(s + 0.5, t * 2);
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
  blanketMesh.material = accentMat;
  group.add(blanketMesh);

  return group;
}

/**
 * 2. Detailed Lounge Armchair with wrap-around shell, tufted cushion,
 * tapered wooden legs, and lumbar pillow.
 */
export function buildChairModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();

  // Angled legs
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

  // Wooden under-frame crossbars
  const basePlate = new THREE.Mesh(new RoundedBoxGeometry(0.76, 0.05, 0.72, 4, 0.015), woodMat);
  basePlate.position.set(0, 0.3, 0);
  basePlate.castShadow = true;
  group.add(basePlate);

  // Upholstered seat bucket base
  const seatBase = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.12, 0.74, 6, 0.045), primaryMat),
    'primary'
  );
  seatBase.position.set(0, 0.37, 0);
  group.add(seatBase);

  // Plush Seat Cushion
  const cushion = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.14, 0.64, 6, 0.055), primaryMat),
    'primary'
  );
  cushion.position.set(0, 0.48, 0.04);
  group.add(cushion);

  // Curved Wrap-around Backrest (3 angled segments forming ergonomic shell)
  const backCenter = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.56, 0.14, 6, 0.05), primaryMat),
    'primary'
  );
  backCenter.position.set(0, 0.69, -0.31);
  backCenter.rotation.x = -0.14;
  group.add(backCenter);

  [-0.36, 0.36].forEach((x, idx) => {
    const sideWing = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.46, 0.56, 6, 0.05), primaryMat),
      'primary'
    );
    sideWing.position.set(x, 0.61, -0.05);
    sideWing.rotation.y = idx === 0 ? -0.12 : 0.12;
    group.add(sideWing);
  });

  // 4 Tufted Buttons on backrest
  [-0.16, 0.16].forEach((x) => {
    [0.62, 0.78].forEach((y) => {
      const btn = tagFabric(
        new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), accentMat),
        'accent'
      );
      btn.scale.set(1, 1, 0.5);
      btn.position.set(x, y, -0.23 - (y - 0.62) * 0.14);
      group.add(btn);
    });
  });

  // Lumbar Accent Pillow
  const lumbar = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.24, 0.11, 6, 0.045), accentMat),
    'accent'
  );
  lumbar.position.set(0, 0.62, -0.12);
  lumbar.rotation.x = -0.22;
  group.add(lumbar);

  return group;
}

/**
 * 3. Hotel Suite Bed with channel-tufted upholstered headboard,
 * crisp mattress, folded duvet, textured bed runner, and 4 pillows.
 */
export function buildBedModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const woodMat = createWoodMaterial();
  const brassMat = createBrassMaterial();
  const sheetMat = createWhiteLinenMaterial();

  // Legs
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

  // Upholstered Bed Frame
  const frame = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(1.94, 0.24, 2.08, 5, 0.04), primaryMat),
    'primary'
  );
  frame.position.set(0, 0.26, 0);
  group.add(frame);

  // Channel-tufted Headboard (5 vertical plush panels)
  const headBack = new THREE.Mesh(new RoundedBoxGeometry(2.02, 1.1, 0.08, 4, 0.02), woodMat);
  headBack.position.set(0, 0.72, -1.03);
  headBack.castShadow = true;
  group.add(headBack);

  [-0.76, -0.38, 0, 0.38, 0.76].forEach((x) => {
    const channel = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(0.36, 1.04, 0.11, 6, 0.045), primaryMat),
      'primary'
    );
    channel.position.set(x, 0.72, -0.97);
    group.add(channel);
  });

  // Crisp White Mattress
  const mattress = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.22, 1.94, 6, 0.05), sheetMat);
  mattress.position.set(0, 0.44, 0.03);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  group.add(mattress);

  // Folded Duvet (covering lower 70% of bed)
  const duvet = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(1.86, 0.12, 1.38, 6, 0.05), primaryMat),
    'primary'
  );
  duvet.position.set(0, 0.54, 0.32);
  group.add(duvet);

  // Textured Bed Runner at Foot of Bed
  const runner = tagFabric(
    new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.035, 0.46, 5, 0.015), accentMat),
    'accent'
  );
  runner.position.set(0, 0.605, 0.68);
  group.add(runner);

  // 2 Large Sleeping Pillows
  [-0.44, 0.44].forEach((x) => {
    const p = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.14, 0.42, 6, 0.06), sheetMat);
    p.position.set(x, 0.61, -0.66);
    p.rotation.x = 0.28;
    p.castShadow = true;
    group.add(p);
  });

  // 2 Accent Throw Pillows
  [-0.4, 0.4].forEach((x) => {
    const p = tagFabric(
      new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.32, 0.13, 6, 0.055), accentMat),
      'accent'
    );
    p.position.set(x, 0.68, -0.46);
    p.rotation.x = -0.25;
    group.add(p);
  });

  return group;
}

/**
 * 4. Draped Curtain & Wholesale Fabric Roll Display
 */
export function buildDrapeModel(
  primaryMat: THREE.Material,
  accentMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const brassMat = createBrassMaterial();
  const woodMat = createWoodMaterial();

  // Minimalist display stand & brass rod
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

  // Curtain Rings
  for (let i = -5; i <= 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.005, 10, 20), brassMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(i * 0.125, 1.84, -0.15);
    group.add(ring);
  }

  // Flowing Sinusoidal Curtain Drape Mesh
  const segX = 64;
  const segY = 32;
  const width = 1.32;
  const height = 1.72;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= segY; iy++) {
    const v = iy / segY; // 0 bottom, 1 top
    const y = 0.1 + v * height;
    // Slight widening flare near the bottom
    const flare = 1 + (1 - v) * 0.08;
    for (let ix = 0; ix <= segX; ix++) {
      const u = ix / segX;
      const x = (u - 0.5) * width * flare;
      const fold = Math.sin(u * Math.PI * 10) * (0.045 + (1 - v) * 0.03);
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

  // Double-sided fabric material clone for drape
  const drapeMesh = tagFabric(new THREE.Mesh(drapeGeo, primaryMat), 'primary');
  group.add(drapeMesh);

  // Wholesale Fabric Roll resting on the plinth
  const roll = tagFabric(
    new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 32), accentMat),
    'accent'
  );
  roll.rotation.z = Math.PI / 2;
  roll.position.set(0, 0.19, 0.16);
  group.add(roll);

  // Cardboard core inside roll
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 1.16, 20),
    new THREE.MeshStandardMaterial({ color: '#A38B70', roughness: 0.9 })
  );
  core.rotation.z = Math.PI / 2;
  core.position.set(0, 0.19, 0.16);
  group.add(core);

  return group;
}
