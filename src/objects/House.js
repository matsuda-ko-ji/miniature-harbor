
import * as THREE from 'three';

export function createHouse(x, z, color = 0xffe0b2) {
  const house = new THREE.Group();

  // マテリアルを定義
  const wallMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9
  });

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xc65b4c,
    roughness: 0.85
  });

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x795038,
    roughness: 0.8
  });

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5eddc,
    roughness: 0.65
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x8acde2,
    metalness: 0.05,
    roughness: 0.2
  });

  // ① 壁
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1, 1.2),
    wallMaterial
  );
  walls.position.y = 0.5;
  house.add(walls);

  // ② 切妻屋根
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.75, 0);
  roofShape.lineTo(0, 0.65);
  roofShape.lineTo(0.75, 0);
  roofShape.closePath();

  const roofGeometry = new THREE.ExtrudeGeometry(roofShape, {
    depth: 1.5,
    bevelEnabled: false
  });

  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 0.98, -0.75);
  house.add(roof);

  // ③ ドア
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.65, 0.045),
    woodMaterial
  );
  door.position.set(0, 0.525, 0.63);
  house.add(door);

  // ドア枠
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.71, 0.035),
    frameMaterial
  );
  doorFrame.position.set(0, 0.535, 0.605);
  house.add(doorFrame);

  // ドアを枠より前に表示
  door.position.z = 0.64;

  // 取っ手
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 8, 8),
    new THREE.MeshStandardMaterial({
      color: 0xd6ae54,
      metalness: 0.75,
      roughness: 0.3
    })
  );
  handle.position.set(0.12, 0.5, 0.675);
  house.add(handle);

  // ④ 窓の生成関数
  function createWindow(px, py, pz, rotationY = 0) {
    const windowGroup = new THREE.Group();

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.42, 0.06),
      frameMaterial
    );
    windowGroup.add(frame);

    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.34, 0.065),
      glassMaterial
    );
    glass.position.z = 0.02;
    windowGroup.add(glass);

    // 窓の十字枠
    const verticalBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.36, 0.075),
      frameMaterial
    );
    verticalBar.position.z = 0.065;
    windowGroup.add(verticalBar);

    const horizontalBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.035, 0.075),
      frameMaterial
    );
    horizontalBar.position.z = 0.065;
    windowGroup.add(horizontalBar);

    windowGroup.rotation.y = rotationY;
    windowGroup.position.set(px, py, pz);

    return windowGroup;
  }

  // 正面の窓
  house.add(createWindow(-0.4, 0.65, 0.64));
  house.add(createWindow(0.4, 0.65, 0.64));

  // 右側面の窓
  house.add(
    createWindow(0.64, 0.65, 0, Math.PI / 2)
  );

  // ⑤ 煙突
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.7, 0.25),
    new THREE.MeshStandardMaterial({
      color: 0x9f6754,
      roughness: 0.95
    })
  );
  chimney.position.set(0.34, 1.58, -0.25);
  house.add(chimney);

  // ⑥ 影の設定
  house.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  // ⑦ 配置
  house.position.set(x, 0, z);

  return house;
}
