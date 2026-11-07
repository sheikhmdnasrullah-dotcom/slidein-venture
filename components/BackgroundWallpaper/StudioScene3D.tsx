'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';

/* ═══════════════════════════════════════════════════════════════════════════
   GEOMETRY HELPERS & PROCEDURAL SOFT STUDIO SHADOW TEXTURE
   ═══════════════════════════════════════════════════════════════════════════ */

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function createCircleShape(radius: number, segments = 64): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, radius, 0, Math.PI * 2, false);
  return s;
}

function createPolygonShape(points: [number, number][]): THREE.Shape {
  const s = new THREE.Shape();
  points.forEach(([x, y], idx) => {
    if (idx === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  });
  s.closePath();
  return s;
}

function useSoftShadowTexture(): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      grad.addColorStop(0, 'rgba(38, 28, 18, 0.18)');
      grad.addColorStop(0.45, 'rgba(38, 28, 18, 0.075)');
      grad.addColorStop(0.78, 'rgba(38, 28, 18, 0.018)');
      grad.addColorStop(1, 'rgba(38, 28, 18, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED INDUSTRIAL-DESIGN MATERIAL PALETTE
   ---------------------------------------------------------------------------
   Restrained, cohesive material language:
   - Warm ivory ceramic & matte porcelain
   - Soft-touch stationery paper & warm stone
   - Satin brushed brass/champagne metal
   - Warm espresso-bronze (never harsh pure black so foreground UI owns ink)
   - Signature SlideIn brand-orange wax & translucent amber
   ═══════════════════════════════════════════════════════════════════════════ */

function useStudioMaterials() {
  return useMemo(() => {
    // Authentic macOS Mail Sky Blue & Azure palette
    const macMailSkyBlue = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2997FF'),
      emissive: new THREE.Color('#007AFF'),
      emissiveIntensity: 0.08,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
    });

    const macMailDeepBlue = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0071E3'),
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.4,
    });

    const macMailLightBlue = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#5AC8FA'),
      roughness: 0.25,
      metalness: 0.02,
      clearcoat: 0.45,
    });

    // Crisp White & Soft Silver Paper (for Mail envelope, Paper Plane, Notes card)
    const ivoryCeramic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      roughness: 0.22,
      metalness: 0.01,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });

    const mattePorcelain = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F1F5F9'),
      roughness: 0.36,
      metalness: 0.02,
      clearcoat: 0.18,
    });

    const softTouchPaper = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      roughness: 0.4,
      metalness: 0.0,
      sheen: 0.25,
      sheenRoughness: 0.45,
      sheenColor: new THREE.Color('#E2E8F0'),
    });

    const warmStone = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#CBD5E1'),
      roughness: 0.45,
      metalness: 0.04,
    });

    const creaseShadow = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0284C7'),
      roughness: 0.5,
      metalness: 0.04,
    });

    // Anodized MacBook Silver / Aluminum
    const satinBrass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#CBD5E1'),
      roughness: 0.24,
      metalness: 0.55,
      clearcoat: 0.35,
    });

    // Charcoal-Slate (for Magnifier handle & subtle accents)
    const warmEspresso = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#475569'),
      roughness: 0.32,
      metalness: 0.18,
      clearcoat: 0.22,
    });

    // Classic Target Coral-Red & Seal Accent
    const brandOrangeWax = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF3B30'),
      emissive: new THREE.Color('#FF3B30'),
      emissiveIntensity: 0.08,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.16,
    });

    // macOS Notes Warm Gold / Target Bullseye Yellow-Gold
    const targetGold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFCC00'),
      emissive: new THREE.Color('#F59E0B'),
      emissiveIntensity: 0.1,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.5,
    });

    // macOS Mint-Emerald Accent
    const mintEmerald = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#34C759'),
      roughness: 0.26,
      metalness: 0.04,
      clearcoat: 0.45,
    });

    const translucentAmber = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#38BDF8'),
      emissive: new THREE.Color('#0284C7'),
      emissiveIntensity: 0.08,
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 0.88,
      transparent: true,
      opacity: 0.88,
    });

    // Sky-Tinted Optical Magnifier Glass
    const opticalGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#BAE6FD'),
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.55,
    });

    const orbitLineWarm = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#CBD5E1'),
      transparent: true,
      opacity: 0.18,
    });

    const orbitLineOrange = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#93C5FD'),
      transparent: true,
      opacity: 0.16,
    });

    return {
      macMailSkyBlue,
      macMailDeepBlue,
      macMailLightBlue,
      ivoryCeramic,
      mattePorcelain,
      softTouchPaper,
      warmStone,
      creaseShadow,
      satinBrass,
      warmEspresso,
      brandOrangeWax,
      targetGold,
      mintEmerald,
      translucentAmber,
      opticalGlass,
      orbitLineWarm,
      orbitLineOrange,
    };
  }, []);
}

type StudioMaterials = ReturnType<typeof useStudioMaterials>;

/* ═══════════════════════════════════════════════════════════════════════════
   1. CUSTOM 3D EXECUTIVE ENVELOPE & EMBOSSED WAX SEAL
   ═══════════════════════════════════════════════════════════════════════════ */

function EnvelopeSculpture({
  materials,
  shadowTex,
}: {
  materials: StudioMaterials;
  shadowTex: THREE.CanvasTexture | null;
}) {
  const geometries = useMemo(() => {
    // Authentic MacBook Mail Sky-Blue Squircle Icon Base
    const squircleTile = new THREE.ExtrudeGeometry(createRoundedRectShape(2.24, 2.24, 0.5), {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 5,
    });

    // Crisp White Envelope Pocket Centered Inside the Sky-Blue Squircle
    const envBase = new THREE.ExtrudeGeometry(createRoundedRectShape(1.58, 1.08, 0.1), {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 4,
    });

    const flapExtrude = {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    };

    // Upper V-Flap of Envelope
    const topFlap = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [-0.76, 0.51],
        [0.76, 0.51],
        [0, -0.08],
      ]),
      flapExtrude
    );

    const leftFlap = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [-0.76, 0.48],
        [-0.04, -0.02],
        [-0.76, -0.5],
      ]),
      flapExtrude
    );

    const rightFlap = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [0.76, 0.48],
        [0.76, -0.5],
        [0.04, -0.02],
      ]),
      flapExtrude
    );

    const bottomFlap = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [-0.75, -0.51],
        [-0.12, 0.02],
        [0.12, 0.02],
        [0.75, -0.51],
      ]),
      flapExtrude
    );

    // Sky-Blue V-Chevron Crease inside the White Envelope so the Mail Flap is Crisp
    const vCrease = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [-0.76, 0.48],
        [0, -0.14],
        [0.76, 0.48],
        [0.76, 0.38],
        [0, -0.24],
        [-0.76, 0.38],
      ]),
      { depth: 0.028, bevelEnabled: false }
    );

    return {
      squircleTile,
      envBase,
      topFlap,
      leftFlap,
      rightFlap,
      bottomFlap,
      vCrease,
    };
  }, []);

  return (
    <group>
      {shadowTex && (
        <mesh position={[0.1, -0.2, -0.3]}>
          <planeGeometry args={[2.9, 2.9]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      )}

      {/* MacBook Mail Sky-Blue Squircle Backing */}
      <mesh geometry={geometries.squircleTile} material={materials.macMailSkyBlue} />

      {/* Crisp White 3D Envelope Centered on Sky-Blue Squircle */}
      <group position={[0, 0, 0.135]}>
        <mesh geometry={geometries.envBase} material={materials.ivoryCeramic} />
        <mesh
          geometry={geometries.leftFlap}
          material={materials.mattePorcelain}
          position={[0, 0, 0.048]}
        />
        <mesh
          geometry={geometries.rightFlap}
          material={materials.mattePorcelain}
          position={[0, 0, 0.052]}
        />
        <mesh
          geometry={geometries.bottomFlap}
          material={materials.ivoryCeramic}
          position={[0, 0, 0.06]}
        />
        <mesh
          geometry={geometries.vCrease}
          material={materials.macMailSkyBlue}
          position={[0, 0, 0.068]}
        />
        <mesh
          geometry={geometries.topFlap}
          material={materials.softTouchPaper}
          position={[0, 0, 0.074]}
        />
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. CUSTOM 3D FOLDED ORIGAMI PAPER AIRPLANE GLIDER
   ═══════════════════════════════════════════════════════════════════════════ */

function PaperAirplaneSculpture({
  materials,
  shadowTex,
}: {
  materials: StudioMaterials;
  shadowTex: THREE.CanvasTexture | null;
}) {
  const geometries = useMemo(() => {
    const plateSettings = {
      depth: 0.026,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    };

    const leftWing = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [1.32, 0],
        [-1.12, 0.94],
        [-0.74, 0.12],
      ]),
      plateSettings
    );

    const rightWing = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [1.32, 0],
        [-0.74, -0.12],
        [-1.12, -0.94],
      ]),
      plateSettings
    );

    const leftKeel = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [1.3, 0],
        [-0.74, 0.12],
        [-0.88, 0],
      ]),
      plateSettings
    );

    const rightKeel = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [1.3, 0],
        [-0.88, 0],
        [-0.74, -0.12],
      ]),
      plateSettings
    );

    const leftWinglet = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [0.45, 0.34],
        [-1.02, 0.9],
        [-1.12, 0.94],
      ]),
      plateSettings
    );

    const noseCap = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [1.34, 0],
        [0.62, 0.25],
        [0.74, 0],
        [0.62, -0.25],
      ]),
      {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.009,
        bevelSize: 0.009,
        bevelSegments: 3,
      }
    );

    return {
      leftWing,
      rightWing,
      leftKeel,
      rightKeel,
      leftWinglet,
      noseCap,
    };
  }, []);

  return (
    <group>
      {shadowTex && (
        <mesh position={[0.1, -0.28, -0.38]}>
          <planeGeometry args={[3.1, 2.3]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      )}

      <group rotation={[0.18, -0.24, -0.22]}>
        <mesh
          geometry={geometries.leftWing}
          material={materials.ivoryCeramic}
          rotation={[0.24, 0, 0]}
        />
        <mesh
          geometry={geometries.rightWing}
          material={materials.macMailLightBlue}
          rotation={[-0.24, 0, 0]}
        />
        <mesh
          geometry={geometries.leftKeel}
          material={materials.macMailSkyBlue}
          rotation={[0.68, 0, 0]}
          position={[0, 0, -0.02]}
        />
        <mesh
          geometry={geometries.rightKeel}
          material={materials.macMailDeepBlue}
          rotation={[-0.68, 0, 0]}
          position={[0, 0, -0.02]}
        />
        <mesh
          geometry={geometries.leftWinglet}
          material={materials.macMailSkyBlue}
          rotation={[0.42, 0, 0]}
        />
        <mesh
          geometry={geometries.noseCap}
          material={materials.macMailDeepBlue}
          position={[0.02, 0, 0.016]}
        />
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. CUSTOM 3D PRECISION RESEARCH TARGET & CALIBRATION APERTURE
   ═══════════════════════════════════════════════════════════════════════════ */

function ResearchTargetSculpture({
  materials,
  shadowTex,
}: {
  materials: StudioMaterials;
  shadowTex: THREE.CanvasTexture | null;
}) {
  const geometries = useMemo(() => {
    // Outward-facing beveled ceramic target disc + inner stepped terrace
    const outerDisc = new THREE.ExtrudeGeometry(createCircleShape(1.14, 64), {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.028,
      bevelSize: 0.028,
      bevelSegments: 5,
    });

    const innerTerrace = new THREE.ExtrudeGeometry(createCircleShape(0.88, 56), {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    });

    const outerBezelRing = new THREE.TorusGeometry(1.06, 0.028, 20, 64);
    const outerOrangeRing = new THREE.TorusGeometry(0.74, 0.056, 24, 56);
    const midPorcelainRing = new THREE.TorusGeometry(0.49, 0.042, 20, 48);
    const innerBrassRing = new THREE.TorusGeometry(0.3, 0.018, 16, 40);
    const bullseyeDome = new THREE.SphereGeometry(0.19, 32, 24);

    const tickGeo = new THREE.BoxGeometry(0.022, 0.085, 0.024);

    // Precision Dart / Stylus
    const dartShaft = new THREE.CylinderGeometry(0.024, 0.035, 0.88, 20);
    const dartTip = new THREE.ConeGeometry(0.024, 0.18, 20);
    const dartCollar = new THREE.TorusGeometry(0.037, 0.01, 12, 24);
    const dartFin = new THREE.ExtrudeGeometry(
      createPolygonShape([
        [0, 0],
        [0.17, 0.13],
        [0.17, 0.32],
        [0, 0.22],
      ]),
      { depth: 0.014, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 }
    );

    return {
      outerDisc,
      innerTerrace,
      outerBezelRing,
      outerOrangeRing,
      midPorcelainRing,
      innerBrassRing,
      bullseyeDome,
      tickGeo,
      dartShaft,
      dartTip,
      dartCollar,
      dartFin,
    };
  }, []);

  const tickAngles = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6),
    []
  );

  return (
    <group>
      {shadowTex && (
        <mesh position={[0.1, -0.25, -0.36]}>
          <planeGeometry args={[2.9, 2.9]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Beveled White Target Disc & Inner Stepped Terrace */}
      <mesh geometry={geometries.outerDisc} material={materials.ivoryCeramic} />
      <mesh
        geometry={geometries.innerTerrace}
        material={materials.mattePorcelain}
        position={[0, 0, 0.075]}
      />
      <mesh
        geometry={geometries.outerBezelRing}
        material={materials.warmStone}
        position={[0, 0, 0.095]}
      />

      {/* Classic Archery Target Rings: Sky-Blue Outer, Coral-Red Inner, Gold Center */}
      <mesh
        geometry={geometries.outerOrangeRing}
        material={materials.macMailSkyBlue}
        position={[0, 0, 0.118]}
      />
      <mesh
        geometry={geometries.midPorcelainRing}
        material={materials.brandOrangeWax}
        position={[0, 0, 0.118]}
      />
      <mesh
        geometry={geometries.innerBrassRing}
        material={materials.targetGold}
        position={[0, 0, 0.122]}
      />

      {/* 12 Radial Calibration Ticks */}
      {tickAngles.map((angle, i) => (
        <mesh
          key={i}
          geometry={geometries.tickGeo}
          material={materials.satinBrass}
          position={[Math.cos(angle) * 0.93, Math.sin(angle) * 0.93, 0.112]}
          rotation={[0, 0, angle + Math.PI / 2]}
        />
      ))}

      {/* Gold Bullseye Core Dome */}
      <mesh
        geometry={geometries.bullseyeDome}
        material={materials.targetGold}
        position={[0, 0, 0.105]}
        scale={[1, 1, 0.45]}
      />

      {/* Pinned 3D Precision Dart with Mint-Emerald Flights */}
      <group position={[0, 0, 0.16]} rotation={[0.52, -0.48, -0.35]}>
        <mesh
          geometry={geometries.dartTip}
          material={materials.satinBrass}
          position={[0, 0.09, 0]}
          rotation={[Math.PI, 0, 0]}
        />
        <mesh
          geometry={geometries.dartShaft}
          material={materials.warmEspresso}
          position={[0, 0.54, 0]}
        />
        <mesh
          geometry={geometries.dartCollar}
          material={materials.satinBrass}
          position={[0, 0.32, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, idx) => (
          <mesh
            key={idx}
            geometry={geometries.dartFin}
            material={materials.mintEmerald}
            position={[0, 0.68, 0]}
            rotation={[0, rot, 0]}
          />
        ))}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CUSTOM 3D LAYERED RESEARCH & EVIDENCE DOSSIER STACK
   ═══════════════════════════════════════════════════════════════════════════ */

function ResearchDossierSculpture({
  materials,
  shadowTex,
}: {
  materials: StudioMaterials;
  shadowTex: THREE.CanvasTexture | null;
}) {
  const geometries = useMemo(() => {
    const sheetGeo = new THREE.ExtrudeGeometry(createRoundedRectShape(2.14, 1.48, 0.16), {
      depth: 0.052,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.016,
      bevelSegments: 4,
    });

    const avatarMedallion = new THREE.ExtrudeGeometry(createCircleShape(0.21, 40), {
      depth: 0.026,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    });

    const avatarRing = new THREE.TorusGeometry(0.225, 0.013, 16, 40);

    const barHeader = new THREE.ExtrudeGeometry(createRoundedRectShape(2.08, 0.38, 0.12), {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    });

    const barAccent = new THREE.ExtrudeGeometry(createRoundedRectShape(0.88, 0.072, 0.035), {
      depth: 0.016,
      bevelEnabled: false,
    });

    const barFull = new THREE.ExtrudeGeometry(createRoundedRectShape(1.58, 0.068, 0.03), {
      depth: 0.015,
      bevelEnabled: false,
    });

    const barShort = new THREE.ExtrudeGeometry(createRoundedRectShape(1.14, 0.068, 0.03), {
      depth: 0.015,
      bevelEnabled: false,
    });

    const tabGeo = new THREE.ExtrudeGeometry(createRoundedRectShape(0.18, 0.32, 0.04), {
      depth: 0.022,
      bevelEnabled: false,
    });

    const clipCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.78, 0.56, 0.072),
      new THREE.Vector3(-0.78, 0.79, 0.072),
      new THREE.Vector3(-0.62, 0.79, 0.05),
      new THREE.Vector3(-0.62, 0.5, -0.01),
    ]);
    const clipGeo = new THREE.TubeGeometry(clipCurve, 28, 0.015, 12, false);

    return {
      sheetGeo,
      avatarMedallion,
      avatarRing,
      barHeader,
      barAccent,
      barFull,
      barShort,
      tabGeo,
      clipGeo,
    };
  }, []);

  return (
    <group>
      {shadowTex && (
        <mesh position={[0.1, -0.24, -0.4]}>
          <planeGeometry args={[3.2, 2.5]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      )}

      {/* 3rd Tier Sheet (Back) */}
      <mesh
        geometry={geometries.sheetGeo}
        material={materials.warmStone}
        position={[0.22, 0.24, -0.2]}
        rotation={[0, 0, -0.11]}
      />

      {/* 2nd Tier Sheet (Middle) + Index Tabs */}
      <group position={[0.1, 0.11, -0.1]} rotation={[0, 0, -0.04]}>
        <mesh geometry={geometries.sheetGeo} material={materials.mattePorcelain} />
        <mesh
          geometry={geometries.tabGeo}
          material={materials.targetGold}
          position={[1.08, 0.28, 0.015]}
        />
        <mesh
          geometry={geometries.tabGeo}
          material={materials.macMailSkyBlue}
          position={[1.08, -0.14, 0.015]}
        />
      </group>

      {/* 1st Tier Foreground Primary macOS Notes / Dossier Sheet */}
      <group rotation={[0, 0, 0.05]}>
        <mesh geometry={geometries.sheetGeo} material={materials.ivoryCeramic} />
        <mesh geometry={geometries.clipGeo} material={materials.satinBrass} />

        {/* macOS Notes Full-Width Warm Gold Top Header Band */}
        <mesh
          geometry={geometries.barHeader}
          material={materials.targetGold}
          position={[0, 0.52, 0.062]}
        />

        {/* Avatar Medallion in Sky Blue */}
        <mesh
          geometry={geometries.avatarMedallion}
          material={materials.macMailSkyBlue}
          position={[-0.58, 0.08, 0.062]}
        />
        <mesh
          geometry={geometries.avatarRing}
          material={materials.satinBrass}
          position={[-0.58, 0.08, 0.075]}
        />

        {/* Subtle Silver & Sky Lines */}
        <mesh
          geometry={geometries.barAccent}
          material={materials.macMailLightBlue}
          position={[0.18, 0.12, 0.065]}
        />
        <mesh
          geometry={geometries.barFull}
          material={materials.warmStone}
          position={[0, -0.22, 0.065]}
        />
        <mesh
          geometry={geometries.barShort}
          material={materials.warmStone}
          position={[-0.22, -0.4, 0.065]}
        />
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. CUSTOM 3D OPTICAL QUALIFICATION LOUPE & INTERLOCKING SIGNAL RING
   ═══════════════════════════════════════════════════════════════════════════ */

function QualificationLoupeSculpture({
  materials,
  shadowTex,
}: {
  materials: StudioMaterials;
  shadowTex: THREE.CanvasTexture | null;
}) {
  const geometries = useMemo(() => {
    const outerBezel = new THREE.TorusGeometry(0.82, 0.092, 28, 56);
    const innerBrassBezel = new THREE.TorusGeometry(0.71, 0.028, 20, 48);
    const glassLens = new THREE.SphereGeometry(0.7, 36, 24);
    const signalTorus = new THREE.TorusGeometry(0.48, 0.052, 24, 48);
    const orbitNode = new THREE.SphereGeometry(0.09, 24, 24);

    const ferrule = new THREE.CylinderGeometry(0.068, 0.078, 0.22, 24);
    const grip = new THREE.CylinderGeometry(0.082, 0.092, 0.72, 24);
    const endCap = new THREE.SphereGeometry(0.092, 24, 16);

    return {
      outerBezel,
      innerBrassBezel,
      glassLens,
      signalTorus,
      orbitNode,
      ferrule,
      grip,
      endCap,
    };
  }, []);

  return (
    <group>
      {shadowTex && (
        <mesh position={[0.08, -0.22, -0.35]}>
          <planeGeometry args={[2.6, 2.6]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      )}

      <mesh geometry={geometries.outerBezel} material={materials.satinBrass} />
      <mesh geometry={geometries.innerBrassBezel} material={materials.ivoryCeramic} />

      <mesh
        geometry={geometries.glassLens}
        material={materials.opticalGlass}
        scale={[1, 1, 0.18]}
      />

      <group rotation={[0.62, 0.44, -0.25]}>
        <mesh geometry={geometries.signalTorus} material={materials.macMailSkyBlue} />
        <mesh
          geometry={geometries.orbitNode}
          material={materials.softTouchPaper}
          position={[0.48, 0, 0]}
        />
      </group>

      <group position={[-0.64, -0.64, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh
          geometry={geometries.ferrule}
          material={materials.satinBrass}
          position={[0, -0.18, 0]}
        />
        <mesh
          geometry={geometries.grip}
          material={materials.warmEspresso}
          position={[0, -0.62, 0]}
        />
        <mesh
          geometry={geometries.endCap}
          material={materials.satinBrass}
          position={[0, -0.98, 0]}
        />
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. CUSTOM 3D OUTBOUND DISPATCH TABLET & POSTMARK
   ═══════════════════════════════════════════════════════════════════════════ */

function DispatchTabletSculpture({
  materials,
  shadowTex,
}: {
  materials: StudioMaterials;
  shadowTex: THREE.CanvasTexture | null;
}) {
  const geometries = useMemo(() => {
    const tablet = new THREE.ExtrudeGeometry(createRoundedRectShape(2.26, 1.48, 0.16), {
      depth: 0.068,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 4,
    });

    const stripeShape = createPolygonShape([
      [-0.1, 0],
      [0.08, 0],
      [0.02, -0.095],
      [-0.16, -0.095],
    ]);
    const stripeGeo = new THREE.ExtrudeGeometry(stripeShape, {
      depth: 0.016,
      bevelEnabled: false,
    });

    const stampBase = new THREE.ExtrudeGeometry(createRoundedRectShape(0.46, 0.54, 0.05), {
      depth: 0.024,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
    });

    const stampDot = new THREE.ExtrudeGeometry(createCircleShape(0.1, 32), {
      depth: 0.016,
      bevelEnabled: false,
    });

    const postmarkOuter = new THREE.TorusGeometry(0.19, 0.014, 14, 36);
    const postmarkInner = new THREE.TorusGeometry(0.12, 0.01, 14, 32);

    const addrBar1 = new THREE.ExtrudeGeometry(createRoundedRectShape(1.06, 0.075, 0.038), {
      depth: 0.016,
      bevelEnabled: false,
    });
    const addrBar2 = new THREE.ExtrudeGeometry(createRoundedRectShape(1.42, 0.058, 0.028), {
      depth: 0.014,
      bevelEnabled: false,
    });
    const addrBar3 = new THREE.ExtrudeGeometry(createRoundedRectShape(0.94, 0.058, 0.028), {
      depth: 0.014,
      bevelEnabled: false,
    });

    return {
      tablet,
      stripeGeo,
      stampBase,
      stampDot,
      postmarkOuter,
      postmarkInner,
      addrBar1,
      addrBar2,
      addrBar3,
    };
  }, []);

  return (
    <group>
      {shadowTex && (
        <mesh position={[0.1, -0.22, -0.35]}>
          <planeGeometry args={[3.1, 2.3]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      )}

      <mesh geometry={geometries.tablet} material={materials.ivoryCeramic} />

      {/* 6 Classic Air-Mail Border Stripes in Red & Sky Blue */}
      {[-0.82, -0.48, -0.14, 0.2, 0.54, 0.88].map((xPos, idx) => (
        <mesh
          key={idx}
          geometry={geometries.stripeGeo}
          material={idx % 2 === 0 ? materials.brandOrangeWax : materials.macMailSkyBlue}
          position={[xPos, 0.71, 0.078]}
        />
      ))}

      {/* Raised Sky-Blue Postage Stamp */}
      <group position={[0.74, 0.22, 0.078]}>
        <mesh geometry={geometries.stampBase} material={materials.macMailSkyBlue} />
        <mesh
          geometry={geometries.stampDot}
          material={materials.softTouchPaper}
          position={[0, 0, 0.022]}
        />
      </group>

      {/* Circular Postmark Rings */}
      <group position={[0.24, 0.22, 0.082]}>
        <mesh geometry={geometries.postmarkOuter} material={materials.warmStone} />
        <mesh geometry={geometries.postmarkInner} material={materials.satinBrass} />
      </group>

      {/* Embossed Routing & Address Bars */}
      <mesh
        geometry={geometries.addrBar1}
        material={materials.warmStone}
        position={[-0.36, -0.12, 0.078]}
      />
      <mesh
        geometry={geometries.addrBar2}
        material={materials.warmStone}
        position={[-0.19, -0.28, 0.078]}
      />
      <mesh
        geometry={geometries.addrBar3}
        material={materials.warmStone}
        position={[-0.43, -0.43, 0.078]}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D ORBITAL STRUCTURES, BEZIER TRAJECTORIES & SIGNAL JUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

function OrbitalStructures3D({
  materials,
}: {
  materials: StudioMaterials;
  reducedMotion: boolean;
}) {
  const { upperTube, lowerTube } = useMemo(() => {
    const uCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-5.4, 2.15, -0.6),
      new THREE.Vector3(-1.8, 3.25, -1.3),
      new THREE.Vector3(1.8, 3.2, -1.3),
      new THREE.Vector3(5.4, 2.05, -0.6)
    );

    const lCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(5.3, -2.15, -0.9),
      new THREE.Vector3(1.6, -3.3, -1.5),
      new THREE.Vector3(-1.6, -3.25, -1.5),
      new THREE.Vector3(-5.2, -2.2, -0.9)
    );

    const uTube = new THREE.TubeGeometry(uCurve, 64, 0.0045, 8, false);
    const lTube = new THREE.TubeGeometry(lCurve, 64, 0.0045, 8, false);

    return {
      upperTube: uTube,
      lowerTube: lTube,
    };
  }, []);

  return (
    <group>
      <mesh geometry={upperTube} material={materials.orbitLineOrange} />
      <mesh geometry={lowerTube} material={materials.orbitLineWarm} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN 3D STUDIO STAGE & MOTION CHOREOGRAPHY
   ═══════════════════════════════════════════════════════════════════════════ */

function StudioStageContent({
  routeProfile,
  reducedMotion,
}: {
  routeProfile: string;
  reducedMotion: boolean;
}) {
  const { viewport, size } = useThree();
  const materials = useStudioMaterials();
  const shadowTex = useSoftShadowTexture();

  const stageRef = useRef<THREE.Group>(null);
  const envRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Group>(null);
  const targetRef = useRef<THREE.Group>(null);
  const dossierRef = useRef<THREE.Group>(null);
  const loupeRef = useRef<THREE.Group>(null);
  const dispatchRef = useRef<THREE.Group>(null);

  const stateRef = useRef({
    targetPointerX: 0,
    targetPointerY: 0,
    pointerX: 0,
    pointerY: 0,
    targetScrollY: 0,
    scrollY: 0,
  });

  useEffect(() => {
    if (reducedMotion) return;

    const s = stateRef.current;
    s.targetScrollY = window.scrollY;
    s.scrollY = window.scrollY;

    const onScroll = () => {
      s.targetScrollY = window.scrollY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      s.targetPointerX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      s.targetPointerY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [reducedMotion]);

  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1100;

  const routeScale =
    routeProfile === 'insights'
      ? 0.84
      : routeProfile === 'pricing' || routeProfile === 'connect'
        ? 0.9
        : 1;
  // Compact, minimalist icon scale so objects float quietly in the margins
  const objScale = (isMobile ? 0.21 : isTablet ? 0.3 : 0.36) * routeScale;

  const halfW = viewport.width / 2;
  const halfH = viewport.height / 2;

  const edgeX = isMobile ? halfW * 0.84 : isTablet ? halfW * 0.82 : halfW * 0.81;
  const midX = isMobile ? halfW * 0.86 : isTablet ? halfW * 0.86 : halfW * 0.85;
  const topY = isMobile ? halfH * 0.76 : halfH * 0.64;
  const botY = isMobile ? -halfH * 0.74 : -halfH * 0.66;

  useFrame(({ clock }) => {
    if (reducedMotion || document.hidden) return;

    const t = clock.getElapsedTime();
    const s = stateRef.current;

    s.pointerX += (s.targetPointerX - s.pointerX) * 0.05;
    s.pointerY += (s.targetPointerY - s.pointerY) * 0.05;
    s.scrollY += (s.targetScrollY - s.scrollY) * 0.075;

    const scrollShift = Math.tanh(s.scrollY / 2400) * 0.48 + Math.sin(s.scrollY / 950) * 0.15;

    if (stageRef.current) {
      stageRef.current.rotation.y = s.pointerX * 0.028;
      stageRef.current.rotation.x = -s.pointerY * 0.022;
    }

    if (envRef.current) {
      envRef.current.position.x = -edgeX + Math.sin(t * 0.34) * 0.08 + s.pointerX * -0.12;
      envRef.current.position.y = topY + Math.cos(t * 0.29) * 0.09 + scrollShift * 0.4 + s.pointerY * 0.09;
      envRef.current.rotation.x = 0.16 + Math.sin(t * 0.27) * 0.04;
      envRef.current.rotation.y = 0.32 + Math.cos(t * 0.23) * 0.05;
      envRef.current.rotation.z = 0.1 + Math.sin(t * 0.21) * 0.028;
    }

    if (planeRef.current) {
      planeRef.current.position.x = edgeX + Math.cos(t * 0.38) * 0.09 + s.pointerX * -0.14;
      planeRef.current.position.y = topY - 0.06 + Math.sin(t * 0.33) * 0.1 + scrollShift * 0.45 + s.pointerY * 0.1;
      planeRef.current.rotation.x = 0.14 + Math.cos(t * 0.31) * 0.045;
      planeRef.current.rotation.y = -0.38 + Math.sin(t * 0.25) * 0.055;
      planeRef.current.rotation.z = 0.08 + Math.cos(t * 0.29) * 0.035;
    }

    if (targetRef.current) {
      targetRef.current.position.x = -midX + Math.cos(t * 0.26) * 0.07 + s.pointerX * -0.08;
      targetRef.current.position.y = -0.1 + Math.sin(t * 0.31) * 0.09 - scrollShift * 0.25 + s.pointerY * 0.06;
      targetRef.current.rotation.x = -0.14 + Math.sin(t * 0.24) * 0.035;
      targetRef.current.rotation.y = 0.42 + Math.cos(t * 0.22) * 0.045;
      targetRef.current.rotation.z = 0.16 + Math.sin(t * 0.19) * 0.025;
    }

    if (dossierRef.current) {
      dossierRef.current.position.x = midX + Math.sin(t * 0.28) * 0.07 + s.pointerX * -0.09;
      dossierRef.current.position.y = -0.06 + Math.cos(t * 0.25) * 0.09 - scrollShift * 0.28 + s.pointerY * 0.07;
      dossierRef.current.rotation.x = 0.12 + Math.cos(t * 0.22) * 0.035;
      dossierRef.current.rotation.y = -0.36 + Math.sin(t * 0.26) * 0.045;
      dossierRef.current.rotation.z = -0.08 + Math.cos(t * 0.2) * 0.025;
    }

    if (loupeRef.current) {
      loupeRef.current.position.x = -edgeX * 0.96 + Math.sin(t * 0.3) * 0.08 + s.pointerX * -0.1;
      loupeRef.current.position.y = botY + Math.cos(t * 0.27) * 0.09 - scrollShift * 0.35 + s.pointerY * 0.08;
      loupeRef.current.rotation.x = -0.18 + Math.cos(t * 0.25) * 0.04;
      loupeRef.current.rotation.y = 0.34 + Math.sin(t * 0.21) * 0.045;
      loupeRef.current.rotation.z = -0.06 + Math.sin(t * 0.24) * 0.025;
    }

    if (dispatchRef.current) {
      dispatchRef.current.position.x = edgeX * 0.96 + Math.cos(t * 0.27) * 0.08 + s.pointerX * -0.1;
      dispatchRef.current.position.y = botY + 0.04 + Math.sin(t * 0.24) * 0.09 - scrollShift * 0.34 + s.pointerY * 0.08;
      dispatchRef.current.rotation.x = -0.14 + Math.sin(t * 0.23) * 0.035;
      dispatchRef.current.rotation.y = -0.34 + Math.cos(t * 0.26) * 0.045;
      dispatchRef.current.rotation.z = 0.1 + Math.cos(t * 0.21) * 0.025;
    }
  });

  return (
    <group ref={stageRef}>
      {/* ── Studio Lighting Setup ─────────────────────────────────────────── */}
      <ambientLight intensity={1.15} color="#FFFDF9" />
      <hemisphereLight args={['#FFFDF9', '#E8DAC8', 1.1]} />
      <directionalLight position={[-6, 8, 9]} intensity={1.85} color="#FFFDF8" />
      <directionalLight position={[7, -5, 6]} intensity={0.95} color="#FF964F" />
      <directionalLight position={[0, 6, 5]} intensity={0.65} color="#FFF9F0" />

      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer
            intensity={2.4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -6]}
            scale={[12, 12, 1]}
            color="#FFFDF9"
          />
          <Lightformer
            intensity={1.6}
            rotation-y={Math.PI / 2}
            position={[-6, 2, -2]}
            scale={[10, 6, 1]}
            color="#FFF5EA"
          />
          <Lightformer
            intensity={1.4}
            rotation-y={-Math.PI / 2}
            position={[6, -2, -2]}
            scale={[10, 6, 1]}
            color="#FFB078"
          />
        </group>
      </Environment>

      {/* ── 3D Orbital Structures & Bezier Trajectories ───────────────────── */}
      <OrbitalStructures3D materials={materials} reducedMotion={reducedMotion} />

      {/* ── 1. Upper-Left: Executive Envelope & Wax Seal ──────────────────── */}
      <group
        ref={envRef}
        position={[-edgeX, topY, 0.2]}
        rotation={[0.16, 0.32, 0.1]}
        scale={objScale * 0.72}
      >
        <EnvelopeSculpture materials={materials} shadowTex={shadowTex} />
      </group>

      {/* ── 2. Upper-Right: Folded Origami Paper Glider ───────────────────── */}
      <group
        ref={planeRef}
        position={[edgeX, topY - 0.06, 0.25]}
        rotation={[0.14, -0.38, 0.08]}
        scale={objScale * 0.95}
      >
        <PaperAirplaneSculpture materials={materials} shadowTex={shadowTex} />
      </group>

      {/* ── 3. Mid-Left: Precision Research Target (Desktop & Tablet) ─────── */}
      {!isMobile && (
        <group
          ref={targetRef}
          position={[-midX, -0.1, -0.35]}
          rotation={[-0.14, 0.42, 0.16]}
          scale={objScale * 0.88}
        >
          <ResearchTargetSculpture materials={materials} shadowTex={shadowTex} />
        </group>
      )}

      {/* ── 4. Mid-Right: Layered Research Dossier (Desktop & Tablet) ─────── */}
      {!isMobile && (
        <group
          ref={dossierRef}
          position={[midX, -0.06, -0.4]}
          rotation={[0.12, -0.36, -0.08]}
          scale={objScale * 0.88}
        >
          <ResearchDossierSculpture materials={materials} shadowTex={shadowTex} />
        </group>
      )}

      {/* ── 5. Lower-Left: Optical Qualification Loupe & Ring ─────────────── */}
      <group
        ref={loupeRef}
        position={[-edgeX * 0.96, botY, -0.2]}
        rotation={[-0.18, 0.34, -0.06]}
        scale={objScale * 0.86}
      >
        <QualificationLoupeSculpture materials={materials} shadowTex={shadowTex} />
      </group>

      {/* ── 6. Lower-Right: Outbound Dispatch Tablet & Postmark ───────────── */}
      <group
        ref={dispatchRef}
        position={[edgeX * 0.96, botY + 0.04, -0.25]}
        rotation={[-0.14, -0.34, 0.1]}
        scale={objScale * 0.88}
      >
        <DispatchTabletSculpture materials={materials} shadowTex={shadowTex} />
      </group>
    </group>
  );
}

export default function StudioScene3D({
  routeProfile,
  reducedMotion,
}: {
  routeProfile: string;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      camera={{ position: [0, 0, 9.2], fov: 36, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <StudioStageContent routeProfile={routeProfile} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
