'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  RotateCw,
  RefreshCw,
  Layers,
  Sparkles,
  Move3d,
  Check,
  Maximize2,
} from 'lucide-react';
import {
  FABRIC_COLORS,
  FABRIC_PRESETS,
  FabricWeaveId,
  createFabricTextures,
} from '@/lib/three/fabricTextures';
import {
  MODEL_TYPES,
  ModelTypeId,
  buildBedModel,
  buildChairModel,
  buildDrapeModel,
  buildSofaModel,
  buildTowelsModel,
} from '@/lib/three/models';

interface Textile3DViewerProps {
  initialModel?: ModelTypeId;
  initialWeave?: FabricWeaveId;
  initialColorId?: string;
  compact?: boolean;
  cardMode?: boolean;
  onExpand?: () => void;
}

export function Textile3DViewer({
  initialModel = 'sofa',
  initialWeave = 'velvet_sherpa',
  initialColorId = 'emerald',
  compact = false,
  cardMode = false,
  onExpand,
}: Textile3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState<ModelTypeId>(initialModel);
  const [selectedWeave, setSelectedWeave] = useState<FabricWeaveId>(initialWeave);
  const [selectedColorId, setSelectedColorId] = useState<string>(initialColorId);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const primaryMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const accentMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const autoRotateRef = useRef(autoRotate);

  const activePreset = FABRIC_PRESETS.find((f) => f.id === selectedWeave) || FABRIC_PRESETS[0];
  const activeColor = FABRIC_COLORS.find((c) => c.id === selectedColorId) || FABRIC_COLORS[0];
  const activeModelMeta = MODEL_TYPES.find((m) => m.id === selectedModel) || MODEL_TYPES[0];

  useEffect(() => {
    setSelectedModel(initialModel);
    setSelectedWeave(initialWeave);
    setSelectedColorId(initialColorId);
  }, [initialModel, initialWeave, initialColorId]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Initialize Three.js Studio Scene once per mounted instance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F3F4F6');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(...activeModelMeta.defaultCamera);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // PMREM Studio IBL Environment for crisp natural lighting & subtle highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.55;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 0.9;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.target.set(...activeModelMeta.target);
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = cardMode ? 1.1 : 0.65;
    controlsRef.current = controls;

    // 3-Point Studio Lighting calibrated to reveal weave normal maps
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#D1D5DB', 0.65);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFFBF2', 1.65);
    keyLight.position.set(3.2, 5.2, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    const d = 2.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#E0F2FE', 0.85);
    rimLight.position.set(-3.5, 2.8, -3.2);
    scene.add(rimLight);

    // Contact shadow floor
    const floorGeo = new THREE.CircleGeometry(6, 48);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // PBR Physical Fabric Materials
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      side: THREE.DoubleSide,
      sheenColor: new THREE.Color('#FFFFFF'),
      envMapIntensity: 0.45,
    });
    const accentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      side: THREE.DoubleSide,
      sheenColor: new THREE.Color('#FFFFFF'),
      envMapIntensity: 0.45,
    });
    primaryMatRef.current = primaryMat;
    accentMatRef.current = accentMat;

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      envRT.dispose();
      primaryMat.dispose();
      accentMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update PBR Textures & Normal Maps when weave or color changes
  useEffect(() => {
    const primaryMat = primaryMatRef.current;
    const accentMat = accentMatRef.current;
    if (!primaryMat || !accentMat) return;

    const primaryTex = createFabricTextures(selectedWeave, activeColor.hex, activePreset.repeat);
    const accentTex = createFabricTextures(
      selectedWeave === 'tartan' ? 'linen' : selectedWeave,
      activeColor.accentHex,
      activePreset.repeat
    );

    primaryMat.map?.dispose();
    primaryMat.normalMap?.dispose();
    primaryMat.roughnessMap?.dispose();
    accentMat.map?.dispose();
    accentMat.normalMap?.dispose();
    accentMat.roughnessMap?.dispose();

    primaryMat.map = primaryTex.map;
    primaryMat.normalMap = primaryTex.normalMap;
    primaryMat.normalScale = new THREE.Vector2(activePreset.normalScale, activePreset.normalScale);
    primaryMat.roughnessMap = primaryTex.roughnessMap;
    primaryMat.roughness = activePreset.roughness;
    primaryMat.sheen = activePreset.sheen;
    primaryMat.sheenRoughness = activePreset.sheenRoughness;
    primaryMat.needsUpdate = true;

    accentMat.map = accentTex.map;
    accentMat.normalMap = accentTex.normalMap;
    accentMat.normalScale = new THREE.Vector2(
      activePreset.normalScale * 0.85,
      activePreset.normalScale * 0.85
    );
    accentMat.roughnessMap = accentTex.roughnessMap;
    accentMat.roughness = Math.min(1, activePreset.roughness + 0.04);
    accentMat.sheen = activePreset.sheen * 0.85;
    accentMat.sheenRoughness = activePreset.sheenRoughness;
    accentMat.needsUpdate = true;
  }, [selectedWeave, selectedColorId, activeColor, activePreset]);

  // Rebuild 3D Model Geometry when selectedModel changes
  useEffect(() => {
    const scene = sceneRef.current;
    const primaryMat = primaryMatRef.current;
    const accentMat = accentMatRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !primaryMat || !accentMat || !camera || !controls) return;

    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
      modelGroupRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry.dispose();
        }
      });
    }

    let built: THREE.Group;
    if (selectedModel === 'sofa') {
      built = buildSofaModel(primaryMat, accentMat);
    } else if (selectedModel === 'chair') {
      built = buildChairModel(primaryMat, accentMat);
    } else if (selectedModel === 'bed') {
      built = buildBedModel(primaryMat, accentMat);
    } else if (selectedModel === 'towels') {
      built = buildTowelsModel(primaryMat, accentMat);
    } else {
      built = buildDrapeModel(primaryMat, accentMat);
    }

    modelGroupRef.current = built;
    scene.add(built);

    camera.position.set(...activeModelMeta.defaultCamera);
    controls.target.set(...activeModelMeta.target);
    controls.update();
  }, [selectedModel, activeModelMeta]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...activeModelMeta.defaultCamera);
      controlsRef.current.target.set(...activeModelMeta.target);
      controlsRef.current.update();
    }
  };

  // Inline compact Card Mode inside Catalog ProductCard
  if (cardMode) {
    return (
      <div className="relative w-full h-full bg-[#F3F4F6]">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Subtle bottom micro-controls inside card */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-slate-200/80 shadow-2xs pointer-events-auto">
            {FABRIC_COLORS.slice(0, 5).map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColorId(color.id);
                }}
                title={color.nameRu}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColorId === color.id
                    ? 'scale-125 ring-1 ring-slate-900 border-white'
                    : 'border-slate-300'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {onExpand && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onExpand();
              }}
              className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 hover:bg-slate-900 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md shadow-2xs transition-colors"
              title="Открыть 3D крупно"
            >
              <Maximize2 className="w-3 h-3 text-teal-400" />
              <span>Крупно</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* 3D WebGL Canvas Area */}
        <div
          className={`relative bg-[#F3F4F6] ${
            compact ? 'lg:col-span-7 h-[380px] sm:h-[440px]' : 'lg:col-span-8 h-[420px] sm:h-[520px]'
          }`}
        >
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top Left Hint */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-2xs">
              <Move3d className="w-3.5 h-3.5 text-teal-600" />
              <span>Вращайте 360° и приближайте текстуру</span>
            </span>
          </div>

          {/* Top Right Camera Controls */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${
                autoRotate
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white/90 text-slate-600 border-slate-200/80 hover:text-slate-900'
              }`}
              title={autoRotate ? 'Остановить вращение' : 'Автовращение'}
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`}
                style={{ animationDuration: '6s' }}
              />
            </button>
            <button
              type="button"
              onClick={handleResetCamera}
              className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 backdrop-blur-md transition-all"
              title="Сбросить ракурс"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Model Switcher Pill Bar */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-slate-200/90 shadow-sm max-w-[94%] overflow-x-auto">
            {MODEL_TYPES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModel(m.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedModel === m.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {m.nameRu}
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls Panel */}
        <div
          className={`${
            compact ? 'lg:col-span-5' : 'lg:col-span-4'
          } p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-slate-200/80 flex flex-col justify-between space-y-4 bg-white`}
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>PBR 3D-материал в интерьере</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-950">{activeModelMeta.nameRu}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{activeModelMeta.subtitleRu}</p>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Цвет партии
                </label>
                <span className="text-[11px] font-semibold text-slate-700">{activeColor.nameRu}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FABRIC_COLORS.map((color) => {
                  const active = color.id === selectedColorId;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColorId(color.id)}
                      title={color.nameRu}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        active
                          ? 'ring-2 ring-slate-900 ring-offset-2 scale-105 border-slate-300'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Fabric Weave Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Фактура переплетения
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-[210px] overflow-y-auto pr-0.5">
                {FABRIC_PRESETS.map((fabric) => {
                  const active = fabric.id === selectedWeave;
                  return (
                    <button
                      key={fabric.id}
                      type="button"
                      onClick={() => setSelectedWeave(fabric.id)}
                      className={`text-left px-2.5 py-1.5 rounded-xl border text-[11px] transition-all flex items-center justify-between ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-semibold block truncate">{fabric.nameRu}</span>
                        <span className={`text-[10px] block truncate ${active ? 'text-slate-300' : 'text-slate-400'}`}>
                          {fabric.gsm} г/м²
                        </span>
                      </div>
                      {active && <Check className="w-3 h-3 text-teal-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Technical Spec Readout */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/70 p-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Текстура: {activePreset.nameTr}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Плотность</span>
                <span className="font-semibold text-slate-900">{activePreset.gsm} г/м²</span>
              </div>
              <div>
                <span className="text-slate-400 block">Martindale</span>
                <span className="font-semibold text-slate-900">{activePreset.martindale}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Состав</span>
                <span className="font-semibold text-slate-900">{activePreset.composition}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
