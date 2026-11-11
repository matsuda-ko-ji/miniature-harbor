
import * as THREE from 'three';

export function createIsland(scene) {
  // 島の土台
  const islandGeometry = new THREE.BoxGeometry(8, 1, 8);
  const islandMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b6345
  });

  const island = new THREE.Mesh(islandGeometry, islandMaterial);
  island.position.y = -0.5;
  scene.add(island);

  // 草地
  const grassGeometry = new THREE.BoxGeometry(8, 0.2, 8);
  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x69ae61
  });

  const grass = new THREE.Mesh(grassGeometry, grassMaterial);
  grass.position.y = 0.1;
  scene.add(grass);

  // 海
  const seaGeometry = new THREE.PlaneGeometry(200, 200);
  const seaMaterial = new THREE.MeshStandardMaterial({
    color: 0x338fc2,
    roughness: 0.5,
    metalness: 0.1
  });

  const sea = new THREE.Mesh(seaGeometry, seaMaterial);
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -1.2;
  scene.add(sea);
}
