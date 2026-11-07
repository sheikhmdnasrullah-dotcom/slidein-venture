/**
 * SLIDEIN VENTURE — 3D GLB ASSET COMPILER
 * ---------------------------------------------------------------------------
 * Builds custom-modelled, multi-material 3D industrial-design objects using
 * Three.js parametric CAD geometries (ExtrudeGeometry with multi-segment
 * bevels, LatheGeometry profiles, TubeGeometry curves) and exports binary
 * .glb files to public/models/*.glb.
 */

import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';

const OUT_DIR = path.join(process.cwd(), 'public', 'models');
fs.mkdirSync(OUT_DIR, { recursive: true });

function roundedRectShape(w, h, r) {
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

/**
 * Minimal standards-compliant GLB 2.0 binary serializer for Three.js Group/Mesh
 * hierarchies (zero DOM/FileReader browser globals required in Node.js).
 */
function exportGroupToGLB(group, filePath) {
  group.updateMatrixWorld(true);
  const meshes = [];
  group.traverse((obj) => {
    if (obj.isMesh && obj.geometry) {
      meshes.push(obj);
    }
  });

  const bufferChunks = [];
  let byteOffset = 0;

  const bufferViews = [];
  const accessors = [];
  const materials = [];
  const gltfMeshes = [];
  const nodes = [];

  for (const mesh of meshes) {
    const geom = mesh.geometry.clone();
    geom.applyMatrix4(mesh.matrixWorld);
    const nonIndexed = geom.index ? geom.toNonIndexed() : geom;
    nonIndexed.computeVertexNormals();

    const posAttr = nonIndexed.getAttribute('position');
    const normAttr = nonIndexed.getAttribute('normal');
    const count = posAttr.count;

    const posArray = new Float32Array(count * 3);
    const normArray = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    for (let i = 0; i < count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      const pz = posAttr.getZ(i);
      posArray[i * 3] = px;
      posArray[i * 3 + 1] = py;
      posArray[i * 3 + 2] = pz;
      if (px < min[0]) min[0] = px;
      if (py < min[1]) min[1] = py;
      if (pz < min[2]) min[2] = pz;
      if (px > max[0]) max[0] = px;
      if (py > max[1]) max[1] = py;
      if (pz > max[2]) max[2] = pz;

      normArray[i * 3] = normAttr.getX(i);
      normArray[i * 3 + 1] = normAttr.getY(i);
      normArray[i * 3 + 2] = normAttr.getZ(i);
    }

    const posBuf = Buffer.from(posArray.buffer);
    const normBuf = Buffer.from(normArray.buffer);

    const posViewIdx = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: posBuf.byteLength,
      target: 34962,
    });
    bufferChunks.push(posBuf);
    byteOffset += posBuf.byteLength;

    const normViewIdx = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: normBuf.byteLength,
      target: 34962,
    });
    bufferChunks.push(normBuf);
    byteOffset += normBuf.byteLength;

    const posAccIdx = accessors.length;
    accessors.push({
      bufferView: posViewIdx,
      componentType: 5126,
      count,
      type: 'VEC3',
      min,
      max,
    });

    const normAccIdx = accessors.length;
    accessors.push({
      bufferView: normViewIdx,
      componentType: 5126,
      count,
      type: 'VEC3',
    });

    const mat = mesh.material;
    const col = mat.color || new THREE.Color(0xfaf6f0);
    const matIdx = materials.length;
    materials.push({
      name: mesh.name ? `${mesh.name}_mat` : `mat_${matIdx}`,
      pbrMetallicRoughness: {
        baseColorFactor: [col.r, col.g, col.b, mat.opacity ?? 1.0],
        metallicFactor: mat.metalness ?? 0.02,
        roughnessFactor: mat.roughness ?? 0.35,
      },
    });

    const meshIdx = gltfMeshes.length;
    gltfMeshes.push({
      name: mesh.name || `mesh_${meshIdx}`,
      primitives: [
        {
          attributes: {
            POSITION: posAccIdx,
            NORMAL: normAccIdx,
          },
          material: matIdx,
        },
      ],
    });

    nodes.push({
      name: mesh.name || `node_${meshIdx}`,
      mesh: meshIdx,
    });
  }

  const binBuffer = Buffer.concat(bufferChunks);
  const binPad = (4 - (binBuffer.byteLength % 4)) % 4;
  const paddedBin =
    binPad > 0 ? Buffer.concat([binBuffer, Buffer.alloc(binPad, 0)]) : binBuffer;

  const gltfJson = {
    asset: { version: '2.0', generator: 'SlideIn-3D-CAD-Compiler' },
    scene: 0,
    scenes: [{ nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes: gltfMeshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: paddedBin.byteLength }],
  };

  const jsonStr = JSON.stringify(gltfJson);
  const jsonBuf = Buffer.from(jsonStr, 'utf8');
  const jsonPad = (4 - (jsonBuf.byteLength % 4)) % 4;
  const paddedJson =
    jsonPad > 0
      ? Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)])
      : jsonBuf;

  const totalLength = 12 + 8 + paddedJson.byteLength + 8 + paddedBin.byteLength;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF'
  header.writeUInt32LE(2, 4); // version 2
  header.writeUInt32LE(totalLength, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(paddedJson.byteLength, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(paddedBin.byteLength, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

  const glb = Buffer.concat([header, jsonHeader, paddedJson, binHeader, paddedBin]);
  fs.writeFileSync(filePath, glb);
  console.log(`Built ${path.basename(filePath)} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
}

// Materials
const matCeramic = new THREE.MeshStandardMaterial({ color: 0xfaf6f0, roughness: 0.26, metalness: 0.02 });
const matPorcelain = new THREE.MeshStandardMaterial({ color: 0xf2ebe0, roughness: 0.44, metalness: 0.01 });
const matPaper = new THREE.MeshStandardMaterial({ color: 0xfffdf9, roughness: 0.58, metalness: 0.0 });
const matStone = new THREE.MeshStandardMaterial({ color: 0xe5dccf, roughness: 0.52, metalness: 0.02 });
const matOrange = new THREE.MeshStandardMaterial({ color: 0xff6200, roughness: 0.22, metalness: 0.05 });
const matBrass = new THREE.MeshStandardMaterial({ color: 0xc9b59a, roughness: 0.3, metalness: 0.65 });
const matCharcoal = new THREE.MeshStandardMaterial({ color: 0x1e1c1a, roughness: 0.36, metalness: 0.2 });

// 1. Envelope & Wax Seal
{
  const g = new THREE.Group();
  const baseGeo = new THREE.ExtrudeGeometry(roundedRectShape(2.4, 1.56, 0.16), {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 4,
  });
  const base = new THREE.Mesh(baseGeo, matCeramic);
  base.name = 'envelope_chassis';
  g.add(base);

  const cardGeo = new THREE.ExtrudeGeometry(roundedRectShape(1.96, 1.18, 0.11), {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
  });
  const card = new THREE.Mesh(cardGeo, matPaper);
  card.position.set(0, 0.28, 0.07);
  card.name = 'envelope_letter';
  g.add(card);

  const sealPts = [
    new THREE.Vector2(0, 0.045),
    new THREE.Vector2(0.16, 0.042),
    new THREE.Vector2(0.21, 0.025),
    new THREE.Vector2(0.25, 0.055),
    new THREE.Vector2(0.28, 0.035),
    new THREE.Vector2(0.29, 0),
  ];
  const sealGeo = new THREE.LatheGeometry(sealPts, 36);
  sealGeo.rotateX(Math.PI / 2);
  const seal = new THREE.Mesh(sealGeo, matOrange);
  seal.position.set(0, -0.06, 0.14);
  seal.name = 'envelope_wax_seal';
  g.add(seal);

  exportGroupToGLB(g, path.join(OUT_DIR, 'envelope.glb'));
}

// 2. Folded Origami Paper Airplane
{
  const g = new THREE.Group();
  const leftWingShape = new THREE.Shape();
  leftWingShape.moveTo(1.25, 0);
  leftWingShape.lineTo(-1.15, 0.92);
  leftWingShape.lineTo(-0.78, 0.14);
  leftWingShape.closePath();

  const wingExtrude = {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
  };
  const leftWing = new THREE.Mesh(new THREE.ExtrudeGeometry(leftWingShape, wingExtrude), matPaper);
  leftWing.rotation.x = 0.22;
  leftWing.name = 'glider_left_wing';
  g.add(leftWing);

  const rightWingShape = new THREE.Shape();
  rightWingShape.moveTo(1.25, 0);
  rightWingShape.lineTo(-0.78, -0.14);
  rightWingShape.lineTo(-1.15, -0.92);
  rightWingShape.closePath();

  const rightWing = new THREE.Mesh(new THREE.ExtrudeGeometry(rightWingShape, wingExtrude), matCeramic);
  rightWing.rotation.x = -0.22;
  rightWing.name = 'glider_right_wing';
  g.add(rightWing);

  const noseShape = new THREE.Shape();
  noseShape.moveTo(1.26, 0);
  noseShape.lineTo(0.65, 0.24);
  noseShape.lineTo(0.65, -0.24);
  noseShape.closePath();
  const nose = new THREE.Mesh(new THREE.ExtrudeGeometry(noseShape, wingExtrude), matOrange);
  nose.position.z = 0.01;
  nose.name = 'glider_orange_nose';
  g.add(nose);

  exportGroupToGLB(g, path.join(OUT_DIR, 'paper-airplane.glb'));
}

// 3. Precision Research Target
{
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.16, 0.14, 48), matCeramic);
  disc.rotation.x = Math.PI / 2;
  disc.name = 'target_chassis';
  g.add(disc);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.065, 24, 48), matOrange);
  ring1.position.z = 0.07;
  ring1.name = 'target_orange_ring';
  g.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.045, 20, 48), matStone);
  ring2.position.z = 0.07;
  ring2.name = 'target_inner_ring';
  g.add(ring2);

  const bullseye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 24), matOrange);
  bullseye.scale.set(1, 1, 0.45);
  bullseye.position.z = 0.08;
  bullseye.name = 'target_bullseye';
  g.add(bullseye);

  exportGroupToGLB(g, path.join(OUT_DIR, 'research-target.glb'));
}

// 4. Layered Research Dossier
{
  const g = new THREE.Group();
  const sheetGeo = new THREE.ExtrudeGeometry(roundedRectShape(2.1, 1.48, 0.16), {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.016,
    bevelSegments: 3,
  });
  const backSheet = new THREE.Mesh(sheetGeo, matStone);
  backSheet.position.set(0.14, 0.16, -0.1);
  backSheet.rotation.z = -0.09;
  backSheet.name = 'dossier_back_sheet';
  g.add(backSheet);

  const frontSheet = new THREE.Mesh(sheetGeo, matCeramic);
  frontSheet.name = 'dossier_front_sheet';
  g.add(frontSheet);

  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 32), matOrange);
  badge.rotation.x = Math.PI / 2;
  badge.position.set(-0.62, 0.32, 0.07);
  badge.name = 'dossier_avatar_seal';
  g.add(badge);

  exportGroupToGLB(g, path.join(OUT_DIR, 'research-dossier.glb'));
}

// 5. Qualification Loupe & Ring
{
  const g = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.09, 28, 56), matCeramic);
  bezel.name = 'loupe_ceramic_bezel';
  g.add(bezel);

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.03, 20, 48), matBrass);
  innerRing.name = 'loupe_brass_ring';
  g.add(innerRing);

  const signalRing = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 24, 48), matOrange);
  signalRing.rotation.set(0.65, 0.45, 0);
  signalRing.name = 'loupe_signal_torus';
  g.add(signalRing);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.095, 0.85, 24), matCharcoal);
  handle.position.set(-0.78, -0.78, 0);
  handle.rotation.z = -Math.PI / 4;
  handle.name = 'loupe_handle';
  g.add(handle);

  exportGroupToGLB(g, path.join(OUT_DIR, 'qualification-loupe.glb'));
}

// 6. Dispatch Card
{
  const g = new THREE.Group();
  const cardGeo = new THREE.ExtrudeGeometry(roundedRectShape(2.24, 1.48, 0.16), {
    depth: 0.065,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 4,
  });
  const card = new THREE.Mesh(cardGeo, matPorcelain);
  card.name = 'dispatch_card_body';
  g.add(card);

  const stampGeo = new THREE.ExtrudeGeometry(roundedRectShape(0.42, 0.5, 0.05), {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  const stamp = new THREE.Mesh(stampGeo, matOrange);
  stamp.position.set(0.74, 0.34, 0.07);
  stamp.name = 'dispatch_postage_stamp';
  g.add(stamp);

  exportGroupToGLB(g, path.join(OUT_DIR, 'dispatch-card.glb'));
}

