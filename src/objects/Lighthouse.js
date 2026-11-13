
import * as THREE from 'three';

export function createLighthouse(x, z) {
  const lighthouse = new THREE.Group();

  // ① マテリアル
  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2f2eb,
    roughness: 0.8
  });

  const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xd94b45,
    roughness: 0.75
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe29a,
    emissive: 0xffb43b,
    emissiveIntensity: 0.4,
    roughness: 0.2
  });

  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x74777b,
    metalness: 0.65,
    roughness: 0.4
  });

  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x78513a,
    roughness: 0.85
  });

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x8acde2,
    roughness: 0.2
  });

  // ② 灯台の本体
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.5, 2.2, 16),
    whiteMaterial
  );
  tower.position.y = 1.1;
  lighthouse.add(tower);

  // 赤い帯
  const stripe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.465, 0.49, 0.35, 16),
    redMaterial
  );
  stripe.position.y = 0.8;
  lighthouse.add(stripe);

  
  // ③ 入口
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.7, 0.035),
    doorMaterial
  );

  // 地面に接する高さへ配置
  door.position.set(0, 0.35, 0.49);
  lighthouse.add(door);

  // ドアノブ
  const doorknob = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 8, 8),
    metalMaterial
  );

  doorknob.position.set(0.1, 0.35, 0.53);
  lighthouse.add(doorknob);

  // ④ 灯台の窓
  // 窓枠
  const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.44, 0.025),
    metalMaterial
  );

  windowFrame.position.set(0, 1.55, 0.41);
  lighthouse.add(windowFrame);

  // 窓ガラス
  const windowGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.38, 0.025),
    windowMaterial
  );

  windowGlass.position.set(0, 1.55, 0.43);
  lighthouse.add(windowGlass);

  // 窓の横枠
  const windowBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.025, 0.03),
    metalMaterial
  );

  windowBar.position.set(0, 1.55, 0.45);
  lighthouse.add(windowBar);

  // ⑤ 展望台
  const balcony = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.12, 16),
    whiteMaterial
  );
  balcony.position.y = 2.25;
  lighthouse.add(balcony);

  // 展望台の床面
  const balconyTopY = 2.31;

  // ⑥ 展望台の手すり
  const railing = new THREE.Group();

  const railingRadius = 0.53;
  const railingHeight = 0.42;

  // 上下の輪状の手すり
  for (const height of [0.05, railingHeight]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(
        railingRadius,
        0.025,
        6,
        32
      ),
      metalMaterial
    );

    // 水平方向に回転
    ring.rotation.x = Math.PI / 2;
    ring.position.y = height;

    railing.add(ring);
  }

  // 縦の支柱
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.02,
        0.02,
        railingHeight,
        6
      ),
      metalMaterial
    );

    post.position.set(
      Math.cos(angle) * railingRadius,
      railingHeight / 2,
      Math.sin(angle) * railingRadius
    );

    railing.add(post);
  }

  // 柵を床面に配置
  railing.position.y = balconyTopY;
  lighthouse.add(railing);

  // ⑦ 灯室
  const lampRoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.45, 16),
    glassMaterial
  );
  lampRoom.position.y = 2.43;
  lighthouse.add(lampRoom);

  // 灯室の金属フレーム
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;

    const frame = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.025,
        0.025,
        0.45,
        6
      ),
      metalMaterial
    );

    frame.position.set(
      Math.cos(angle) * 0.35,
      2.43,
      Math.sin(angle) * 0.35
    );

    lighthouse.add(frame);
  }

  // ⑧ 屋根
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(
      0.48,
      0.45,
      16
    ),
    redMaterial
  );
  roof.position.y = 2.88;
  lighthouse.add(roof);

  // ⑨ 回転ライト
  const beacon = new THREE.Group();
  beacon.position.y = 2.45;

  const light = new THREE.SpotLight(
    0xffdf80,
    50,
    12,
    Math.PI / 9,
    0.6
  );

  light.position.set(0, 0, 0);
  beacon.add(light);

  // 光が向かう方向
  light.target.position.set(5, -1.5, 0);
  beacon.add(light.target);

  // 光のビーム
  const beamGeometry = new THREE.ConeGeometry(
    0.7,
    5,
    16,
    1,
    true
  );

  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe58a,
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const beam = new THREE.Mesh(
    beamGeometry,
    beamMaterial
  );

  beam.rotation.z = Math.PI / 2;
  beam.position.x = 2.5;
  beacon.add(beam);

  lighthouse.add(beacon);

  // main.jsからライトの回転を制御できるようにする
  lighthouse.userData.beacon = beacon;

  // 外部からビームの透明度を変更できるようにする
  lighthouse.userData.beamMaterial = beamMaterial;

  // ⑩ 影の設定
  lighthouse.traverse((object) => {
    if (object.isMesh && object !== beam) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  // ⑪ 灯台全体を配置
  lighthouse.position.set(x, 0.2, z);

  return lighthouse;
}
