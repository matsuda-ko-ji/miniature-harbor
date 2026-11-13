
import * as THREE from 'three';

export function createBoat(x, z) {
  const boat = new THREE.Group();

  // ① マテリアル
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5236,
    roughness: 0.85,
    flatShading: true
  });

  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0xb88452,
    roughness: 0.9
  });

  const darkWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x65432d,
    roughness: 0.95
  });

  const sailMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff1d0,
    side: THREE.DoubleSide,
    roughness: 0.85
  });

  // ② 船体の形状を定義
  // X方向が船の前後方向
  const hullShape = new THREE.Shape();

  hullShape.moveTo(-0.9, -0.35);
  hullShape.lineTo(-0.65, -0.55);
  hullShape.lineTo(0.55, -0.55);
  hullShape.lineTo(1.0, 0);
  hullShape.lineTo(0.55, 0.55);
  hullShape.lineTo(-0.65, 0.55);
  hullShape.lineTo(-0.9, 0.35);
  hullShape.closePath();

  // ③ 船体を立体化
  const hullGeometry = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 1
  });

  // 押し出し方向をY方向に変換
  hullGeometry.rotateX(-Math.PI / 2);
  hullGeometry.translate(0, -0.25, 0);

  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.castShadow = true;
  boat.add(hull);

  // ④ 甲板
  const deckShape = new THREE.Shape();

  deckShape.moveTo(-0.75, -0.32);
  deckShape.lineTo(-0.5, -0.43);
  deckShape.lineTo(0.45, -0.43);
  deckShape.lineTo(0.8, 0);
  deckShape.lineTo(0.45, 0.43);
  deckShape.lineTo(-0.5, 0.43);
  deckShape.lineTo(-0.75, 0.32);
  deckShape.closePath();

  const deckGeometry = new THREE.ShapeGeometry(deckShape);
  deckGeometry.rotateX(-Math.PI / 2);

  const deck = new THREE.Mesh(deckGeometry, deckMaterial);
  deck.position.y = 0.17;
  deck.receiveShadow = true;
  boat.add(deck);

  // ⑤ マスト
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.06, 2.1, 8),
    darkWoodMaterial
  );

  mast.position.y = 1.1;
  mast.castShadow = true;
  boat.add(mast);

  // ⑥ 帆
  const sailGeometry = new THREE.BufferGeometry();

  const vertices = new Float32Array([
    0.05, 2.05, 0,
    0.05, 0.45, 0,
    0.95, 0.45, 0
  ]);

  sailGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(vertices, 3)
  );
  sailGeometry.computeVertexNormals();

  const sail = new THREE.Mesh(sailGeometry, sailMaterial);
  sail.castShadow = true;
  boat.add(sail);

  // ⑦ 船縁の木材
  for (const pz of [-0.5, 0.5]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.12, 0.07),
      darkWoodMaterial
    );

    rail.position.set(-0.1, 0.15, pz);
    rail.castShadow = true;
    boat.add(rail);
  }

  // ⑧ 船尾の小さな座席
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.08, 0.7),
    deckMaterial
  );

  seat.position.set(-0.55, 0.25, 0);
  boat.add(seat);

  // ⑨ 船全体を配置
  // 既存アニメーションの基準位置を維持
  boat.position.set(x, -1.0, z);

  return boat;
}
