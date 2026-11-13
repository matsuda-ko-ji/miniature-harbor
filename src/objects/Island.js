
import * as THREE from 'three';

export function createIsland(scene) {
  // 島の土台
  const islandGeometry = new THREE.BoxGeometry(8, 1, 8);

  const islandMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b6345,
    roughness: 1
  });

  const island = new THREE.Mesh(
    islandGeometry,
    islandMaterial
  );

  island.position.y = -0.5;
  island.receiveShadow = true;
  scene.add(island);

  // 草地
  const grassGeometry = new THREE.BoxGeometry(8, 0.2, 8);

  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x69ae61,
    roughness: 1
  });

  const grass = new THREE.Mesh(
    grassGeometry,
    grassMaterial
  );

  grass.position.y = 0.1;
  grass.receiveShadow = true;

  scene.add(grass);
}
