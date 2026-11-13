
import * as THREE from 'three';

export function createRoad(x, z, width, depth) {
  const road = new THREE.Group();

  // 道路の下地
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x77736d,
    roughness: 1
  });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.03, depth),
    baseMaterial
  );

  base.receiveShadow = true;
  road.add(base);

  // 石材のマテリアル
  const stoneMaterials = [
    0xa9a49b,
    0xbdb8ae,
    0x938f88,
    0xa39d93
  ].map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.95,
    flatShading: true
  }));

  // 石畳の大きさ
  const tileSize = 0.4;
  const gap = 0.035;

  const columns = Math.ceil(width / tileSize);
  const rows = Math.ceil(depth / tileSize);

  const cellWidth = width / columns;
  const cellDepth = depth / rows;

  // 石を敷き詰める
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const px = -width / 2 + cellWidth * (col + 0.5);
      const pz = -depth / 2 + cellDepth * (row + 0.5);

      // 縦方向の道路では交差点の石を配置しない
      if (
        depth > width &&
        Math.abs(px + x) < 0.65 &&
        Math.abs(pz + z) < 0.65
      ) {
        continue;
      }

      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(
          cellWidth - gap,
          0.025,
          cellDepth - gap
        ),
        stoneMaterials[(row * 3 + col * 7) % stoneMaterials.length]
      );

      stone.position.set(px, 0.028, pz);
      stone.receiveShadow = true;

      road.add(stone);
    }
  }

  // 道路全体を配置
  road.position.set(x, 0.23, z);

  return road;
}
