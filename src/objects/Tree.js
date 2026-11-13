
import * as THREE from 'three';

export function createTree(x, z, type = 'pine') {
  const tree = new THREE.Group();

  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x795548,
    roughness: 0.95
  });

  // 幹
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.14, 0.7, 8),
    trunkMaterial
  );
  trunk.position.y = 0.35;
  tree.add(trunk);

  if (type === 'pine') {
    // 針葉樹：3段の円錐を重ねる
    const leafColors = [
      0x276d3d,
      0x328a4b,
      0x419c55
    ];

    for (let i = 0; i < 3; i++) {
      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(
          0.55 - i * 0.1,
          0.9,
          8
        ),
        new THREE.MeshStandardMaterial({
          color: leafColors[i],
          roughness: 0.9,
          flatShading: true
        })
      );

      leaves.position.y = 0.85 + i * 0.4;
      tree.add(leaves);
    }

  } else if (type === 'broadleaf') {
    // 広葉樹：複数の球体で樹冠を作る
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x54a85b,
      roughness: 0.9,
      flatShading: true
    });

    const positions = [
      [-0.3, 0.95, 0],
      [0.3, 0.95, 0],
      [0, 1.25, 0.15],
      [0, 1, -0.3]
    ];

    for (const [px, py, pz] of positions) {
      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(0.43, 6, 6),
        leafMaterial
      );

      leaves.position.set(px, py, pz);
      tree.add(leaves);
    }
  }

  // 影の設定
  tree.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  // 草地の上面は y = 0.2
  tree.position.set(x, 0.2, z);

  return tree;
}
