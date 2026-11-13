
import * as THREE from 'three';

export function createRoad(x, z, width, depth) {
  const road = new THREE.Group();

  // ========================================
  // ① 道路の下地
  // ========================================

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

  // ========================================
  // ② 石畳の設定
  // ========================================

  const tileSize = 0.4;
  const gap = 0.035;

  const columns = Math.ceil(width / tileSize);
  const rows = Math.ceil(depth / tileSize);

  const cellWidth = width / columns;
  const cellDepth = depth / rows;

  // 石材の色
  const stoneColors = [
    0xa9a49b,
    0xbdb8ae,
    0x938f88,
    0xa39d93
  ];

  // ========================================
  // ③ 石の配置情報を作成
  // ========================================

  const positions = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const px = -width / 2 + cellWidth * (col + 0.5);
      const pz = -depth / 2 + cellDepth * (row + 0.5);

      // 縦方向の道路では交差点の石を省略
      if (
        depth > width &&
        Math.abs(px + x) < 0.65 &&
        Math.abs(pz + z) < 0.65
      ) {
        continue;
      }

      positions.push({
        px,
        pz,
        row,
        col
      });
    }
  }

  // ========================================
  // ④ InstancedMeshを作成
  // ========================================

  // 全石畳で共通の形状
  const stoneGeometry = new THREE.BoxGeometry(
    cellWidth - gap,
    0.025,
    cellDepth - gap
  );

  // 石の色は個別に設定するため白を使用
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    flatShading: true
  });

  const stones = new THREE.InstancedMesh(
    stoneGeometry,
    stoneMaterial,
    positions.length
  );

  // 一時的な変換用オブジェクト
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  // ========================================
  // ⑤ 各石の位置と色を設定
  // ========================================

  positions.forEach(({ px, pz, row, col }, index) => {
    // 石の位置
    dummy.position.set(px, 0.028, pz);

    // 変換行列を更新
    dummy.updateMatrix();

    // 石の配置行列を設定
    stones.setMatrixAt(index, dummy.matrix);

    // 石の色を設定
    const colorIndex =
      (row * 3 + col * 7) % stoneColors.length;

    color.setHex(stoneColors[colorIndex]);

    stones.setColorAt(index, color);
  });

  // GPUへ更新を通知
  stones.instanceMatrix.needsUpdate = true;

  if (stones.instanceColor) {
    stones.instanceColor.needsUpdate = true;
  }

  // ========================================
  // ⑥ 影の設定
  // ========================================

  stones.castShadow = false;
  stones.receiveShadow = true;

  road.add(stones);

  // ========================================
  // ⑦ 道路全体の配置
  // ========================================

  road.position.set(x, 0.23, z);

  return road;
}
