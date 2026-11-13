
import * as THREE from 'three';

export function createHouse(x, z, color = 0xffe0b2) {
  const house = new THREE.Group();

  // ========================================
  // ① マテリアル
  // ========================================

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
    emissive: 0xffc477,
    emissiveIntensity: 0,
    metalness: 0.05,
    roughness: 0.2
  });

  const chimneyMaterial = new THREE.MeshStandardMaterial({
    color: 0x9f6754,
    roughness: 0.95
  });

  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xd6ae54,
    metalness: 0.75,
    roughness: 0.3
  });

  const lampBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x554433,
    metalness: 0.6,
    roughness: 0.4
  });

  const lampGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd28a,
    emissive: 0xffb347,
    emissiveIntensity: 0
  });

  // ========================================
  // ② 壁
  // ========================================

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1, 1.2),
    wallMaterial
  );

  // 壁の底面を地面に合わせる
  walls.position.y = 0.5;
  house.add(walls);

  // ========================================
  // ③ 切妻屋根
  // ========================================

  const roofShape = new THREE.Shape();

  roofShape.moveTo(-0.75, 0);
  roofShape.lineTo(0, 0.65);
  roofShape.lineTo(0.75, 0);
  roofShape.closePath();

  const roofGeometry = new THREE.ExtrudeGeometry(
    roofShape,
    {
      depth: 1.5,
      bevelEnabled: false
    }
  );

  const roof = new THREE.Mesh(
    roofGeometry,
    roofMaterial
  );

  // 壁の上端に屋根を配置
  roof.position.set(0, 0.98, -0.75);
  house.add(roof);

  // ========================================
  // ④ ドア・ドア枠・取っ手
  // ========================================

  // ドア枠
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.71, 0.035),
    frameMaterial
  );

  doorFrame.position.set(0, 0.335, 0.605);
  house.add(doorFrame);

  // ドア
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.65, 0.045),
    woodMaterial
  );

  door.position.set(0, 0.325, 0.64);
  house.add(door);

  // ドアの取っ手
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 8, 8),
    handleMaterial
  );

  handle.position.set(0.12, 0.3 , 0.675);
  house.add(handle);

  // ========================================
  // ⑤ 窓
  // ========================================

  function createWindow(px, py, pz, rotationY = 0) {
    const windowGroup = new THREE.Group();

    // 窓枠
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.42, 0.06),
      frameMaterial
    );

    windowGroup.add(frame);

    // 窓ガラス
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.34, 0.065),
      glassMaterial
    );

    glass.position.z = 0.02;
    windowGroup.add(glass);

    // 窓の縦枠
    const verticalBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.36, 0.075),
      frameMaterial
    );

    verticalBar.position.z = 0.065;
    windowGroup.add(verticalBar);

    // 窓の横枠
    const horizontalBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.035, 0.075),
      frameMaterial
    );

    horizontalBar.position.z = 0.065;
    windowGroup.add(horizontalBar);

    // 配置と回転
    windowGroup.rotation.y = rotationY;
    windowGroup.position.set(px, py, pz);

    return windowGroup;
  }

  // 正面左側の窓
  house.add(
    createWindow(-0.4, 0.65, 0.64)
  );

  // 右側面の窓
  house.add(
    createWindow(0.64, 0.65, 0, Math.PI / 2)
  );

  // ========================================
  // ⑥ 煙突
  // ========================================

  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.7, 0.25),
    chimneyMaterial
  );

  chimney.position.set(0.34, 1.58, -0.25);
  house.add(chimney);

  // ========================================
  // ⑦ 玄関灯
  // ========================================

  // 玄関灯の位置
  const lampX = 0.37;
  const lampY = 0.55;

  // 台座
  const lampBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.18, 0.09),
    lampBaseMaterial
  );

  lampBase.position.set(lampX, lampY, 0.67);
  house.add(lampBase);

  // 発光するガラス
  const lampGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.12, 0.105),
    lampGlassMaterial
  );

  lampGlass.position.set(lampX, lampY, 0.73);
  house.add(lampGlass);

  // 玄関付近を照らすPointLight
  const porchLight = new THREE.PointLight(
    0xffc477,
    0,
    2.0
  );

  porchLight.position.set(lampX, lampY, 0.85);
  house.add(porchLight);

  // ========================================
  // ⑧ 外部から照明を操作するための設定
  // ========================================

  house.userData.porchLight = porchLight;
  house.userData.lampGlassMaterial = lampGlassMaterial;
  house.userData.windowMaterial = glassMaterial;

  // ========================================
  // ⑨ 影の設定
  // ========================================

  house.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  // 発光部分が周囲に不自然な影を落とさないようにする
  lampGlass.castShadow = false;

  // ========================================
  // ⑩ 建物全体の配置
  // ========================================

  // 草地の上面は y = 0.2
  house.position.set(x, 0.2, z);

  return house;
}
