
import * as THREE from 'three';

export function createHouse(x, z, color = 0xffe0b2) {
  const house = new THREE.Group();

  // 壁
  const wallGeometry = new THREE.BoxGeometry(1.2, 1, 1.2);
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: color
  });

  const walls = new THREE.Mesh(wallGeometry, wallMaterial);
  walls.position.y = 0.7;
  house.add(walls);

  // 屋根（四角錐）
  const roofGeometry = new THREE.ConeGeometry(1.05, 0.65, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xc65b4c
  });

  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 1.52;
  house.add(roof);

  // ドア
  const doorGeometry = new THREE.BoxGeometry(0.3, 0.55, 0.04);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x795038
  });

  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 0.475, 0.62);
  house.add(door);

  // 家全体を配置
  house.position.set(x, 0.2, z);

  return house;
}
