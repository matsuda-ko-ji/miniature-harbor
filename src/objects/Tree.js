
import * as THREE from 'three';

export function createTree(x, z) {
  const tree = new THREE.Group();

  // 幹
  const trunkGeometry = new THREE.CylinderGeometry(
    0.1, 0.13, 0.6, 8
  );
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x795548
  });

  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 0.3;
  tree.add(trunk);

  // 葉
  const leavesGeometry = new THREE.ConeGeometry(0.55, 1.2, 8);
  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: 0x318b4d
  });

  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 1.05;
  tree.add(leaves);

  tree.position.set(x, 0.2, z);

  return tree;
}
