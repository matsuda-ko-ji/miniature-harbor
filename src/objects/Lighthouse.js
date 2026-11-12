
import * as THREE from 'three';

export function createLighthouse(x, z) {
  const lighthouse = new THREE.Group();

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2f2eb
  });

  const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xd94b45
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe29a,
    emissive: 0xffb43b,
    emissiveIntensity: 0.4
  });

  // 灯台の本体
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.5, 2.2, 12),
    whiteMaterial
  );
  tower.position.y = 1.1;
  lighthouse.add(tower);

  // 赤い帯
  const stripe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.46, 0.35, 12),
    redMaterial
  );
  stripe.position.y = 0.8;
  lighthouse.add(stripe);

  // 上部の灯室
  const lampRoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.45, 12),
    glassMaterial
  );
  lampRoom.position.y = 2.43;
  lighthouse.add(lampRoom);

  // 屋根
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.48, 0.45, 12),
    redMaterial
  );
  roof.position.y = 2.88;
  lighthouse.add(roof);

  // 灯台の配置
  lighthouse.position.set(x, 0.2, z);

  // 回転するライトをまとめるGroup
  const beacon = new THREE.Group();
  beacon.position.y = 2.45;

  // 黄色い光源
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

  // 光のビームを可視化する
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

  const beam = new THREE.Mesh(beamGeometry, beamMaterial);

  beam.rotation.z = Math.PI / 2;
  beam.position.x = 2.5;
  beacon.add(beam);

  lighthouse.add(beacon);

  // main.jsから回転を制御できるように保持
  lighthouse.userData.beacon = beacon;

  return lighthouse;
}
