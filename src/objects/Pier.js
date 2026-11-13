
import * as THREE from 'three';

export function createPier(x, z) {
  const pier = new THREE.Group();

  // 木材の色を複数用意
  const woodMaterials = [
    0xa67545,
    0xb98755,
    0x95663d,
    0xc09360
  ].map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.95
  }));

  const darkWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x654528,
    roughness: 1
  });

  // ① 桟橋の横幅と奥行き
  const length = 3.2;
  const depth = 1.2;

  const plankCount = 8;
  const plankGap = 0.04;

  const plankWidth = length / plankCount - plankGap;

  // ② 木の板を1枚ずつ作成
  for (let i = 0; i < plankCount; i++) {
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(plankWidth, 0.14, depth),
      woodMaterials[i % woodMaterials.length]
    );

    plank.position.set(
      -length / 2 + (i + 0.5) * (length / plankCount),
      0,
      0
    );

    plank.castShadow = true;
    plank.receiveShadow = true;

    pier.add(plank);
  }

  // ③ 桟橋を支える横梁
  for (const pz of [-0.45, 0.45]) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.15, 0.12),
      darkWoodMaterial
    );

    beam.position.set(0, -0.13, pz);
    beam.castShadow = true;
    pier.add(beam);
  }

  // ④ 支柱を配置
  for (const px of [-1.3, 1.3]) {
    for (const pz of [-0.45, 0.45]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 1.6, 8),
        darkWoodMaterial
      );

      post.position.set(px, -0.75, pz);
      post.castShadow = true;
      pier.add(post);
    }
  }

  // ⑤ 係留用の杭を追加
  for (const px of [-1.3, 1.3]) {
    for (const pz of [-0.52, 0.52]) {
      const bollard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.09, 0.28, 8),
        darkWoodMaterial
      );

      bollard.position.set(px, 0.2, pz);
      bollard.castShadow = true;
      pier.add(bollard);
    }
  }

  // 桟橋全体を配置
  pier.position.set(x, 0.18, z);

  return pier;
}
