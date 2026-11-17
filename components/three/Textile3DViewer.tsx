'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCw,
  RefreshCw,
  Layers,
  Sparkles,
  Move3d,
  Check,
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
} from '@/lib/three/models';

interface Textile3DViewerProps {
  initialModel?: ModelTypeId;
  initialWeave?: FabricWeaveId;
  initialColorId?: string;
  compact?: boolean;
}

export function Textile3DViewer({
  initialModel = 'sofa',
  initialWeave = 'velvet',
  initialColorId = 'emerald',
  compact = false,
}: Textile3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState<ModelTypeId>(initialModel);
  const [selectedWeave, setSelectedWeave] = useState<FabricWeaveId>(initialWeave);
  const [selectedColorId, setSelectedColorId] = useState<string>(initialColorId);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Refs to update Three.js scene without recreating WebGLRenderer
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
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Initialize Three.js Scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F4F5F7');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(...activeModelMeta.defaultCamera);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.3;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.target.set(...activeModelMeta.target);
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 0.7;
    controlsRef.current = controls;

    // Studio 3-point lighting
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#CBD5E1', 0.85);
    hemiLight.position.set(0, 6, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFF9F0', 1.75);
    keyLight.position.set(3.5, 5.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    const d = 2.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#E0F2FE', 0.75);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Soft matte studio floor with shadows
    const floorGeo = new THREE.CircleGeometry(6, 48);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle studio pedestal ring
    const ringGeo = new THREE.RingGeometry(1.55, 1.57, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#CBD5E1',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    // Fabric Physical Materials
    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      side: THREE.DoubleSide,
      sheenColor: new THREE.Color('#FFFFFF'),
      sheenRoughness: 0.65,
    });
    const accentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      side: THREE.DoubleSide,
      sheenColor: new THREE.Color('#FFFFFF'),
      sheenRoughness: 0.7,
    });
    primaryMatRef.current = primaryMat;
    accentMatRef.current = accentMat;

    // Animation Loop
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize
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
      primaryMat.dispose();
      accentMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Fabric Textures & Material properties when weave or color changes
  useEffect(() => {
    const primaryMat = primaryMatRef.current;
    const accentMat = accentMatRef.current;
    if (!primaryMat || !accentMat) return;

    const primaryTex = createFabricTextures(selectedWeave, activeColor.hex, activePreset.repeat);
    const accentTex = createFabricTextures(
      selectedWeave === 'boucle' ? 'linen' : selectedWeave,
      activeColor.accentHex,
      activePreset.repeat
    );

    // Dispose old textures
    primaryMat.map?.dispose();
    primaryMat.bumpMap?.dispose();
    accentMat.map?.dispose();
    accentMat.bumpMap?.dispose();

    primaryMat.map = primaryTex.map;
    primaryMat.bumpMap = primaryTex.bumpMap;
    primaryMat.bumpScale = activePreset.bumpScale;
    primaryMat.roughness = activePreset.roughness;
    primaryMat.metalness = activePreset.metalness;
    primaryMat.sheen = activePreset.sheen;
    primaryMat.needsUpdate = true;

    accentMat.map = accentTex.map;
    accentMat.bumpMap = accentTex.bumpMap;
    accentMat.bumpScale = activePreset.bumpScale * 0.85;
    accentMat.roughness = Math.min(1, activePreset.roughness + 0.05);
    accentMat.metalness = activePreset.metalness;
    accentMat.sheen = activePreset.sheen * 0.8;
    accentMat.needsUpdate = true;
  }, [selectedWeave, selectedColorId, activeColor, activePreset]);

  // Rebuild 3D Model when selectedModel changes
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
    } else {
      built = buildDrapeModel(primaryMat, accentMat);
    }

    modelGroupRef.current = built;
    scene.add(built);

    // Smoothly reset camera framing for the selected model
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-12' : 'lg:grid-cols-12'}`}>
        {/* 3D WebGL Canvas Area */}
        <div
          className={`relative bg-[#F4F5F7] ${
            compact ? 'lg:col-span-8 h-[360px] sm:h-[420px]' : 'lg:col-span-8 h-[400px] sm:h-[520px]'
          }`}
        >
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top Left Minimalist Hint */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-2xs">
              <Move3d className="w-3.5 h-3.5 text-teal-600" />
              <span>Вращайте 360° и приближайте</span>
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
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
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
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-slate-200/90 shadow-sm max-w-[92%] overflow-x-auto">
            {MODEL_TYPES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModel(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* Right Controls Panel: Textures, Colors & Live Specs */}
        <div className="lg:col-span-4 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-slate-200/80 flex flex-col justify-between space-y-5 bg-white">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Текстура в реальном времени</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-950">{activeModelMeta.nameRu}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeModelMeta.subtitleRu}</p>
            </div>

            {/* Fabric Weave Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Фактура турецкой ткани
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {FABRIC_PRESETS.map((fabric) => {
                  const active = fabric.id === selectedWeave;
                  return (
                    <button
                      key={fabric.id}
                      type="button"
                      onClick={() => setSelectedWeave(fabric.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{fabric.nameRu}</span>
                        <span className={`text-[10px] ${active ? 'text-slate-300' : 'text-slate-400'}`}>
                          {fabric.nameTr} • {fabric.gsm} г/м²
                        </span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Оттенок партии
                </label>
                <span className="text-xs font-semibold text-slate-700">{activeColor.nameRu}</span>
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
                      className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
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
          </div>

          {/* Live Technical Spec Readout */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/70 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Характеристики полотна</span>
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
