
import * as THREE from 'three';

export function createPier(x, z) {
  const pier = new THREE.Group();

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0xa67545,
    roughness: 0.9
  });

  const supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x725032
  });

  // 桟橋の床
  const deckGeometry = new THREE.BoxGeometry(3.2, 0.18, 1.2);
  const deck = new THREE.Mesh(deckGeometry, woodMaterial);
  deck.position.y = -0.05;
  pier.add(deck);

  // 床板の継ぎ目
  for (let i = 0; i < 8; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.01, 1.18),
      supportMaterial
    );

    line.position.set(-1.4 + i * 0.4, 0.046, 0);
    pier.add(line);
  }

  // 桟橋を支える柱
  for (const px of [-1.3, 1.3]) {
    for (const pz of [-0.45, 0.45]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 1.7, 8),
        supportMaterial
      );

      post.position.set(px, -0.9, pz);
      pier.add(post);
    }
  }

  pier.position.set(x, 0.18, z);

  return pier;
}
