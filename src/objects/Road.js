
import * as THREE from 'three';

export function createRoad(x, z, width, depth) {
  const geometry = new THREE.BoxGeometry(width, 0.03, depth);
  const material = new THREE.MeshStandardMaterial({
    color: 0x777777
  });

  const road = new THREE.Mesh(geometry, material);

  road.position.set(x, 0.23, z);

  return road;
}
