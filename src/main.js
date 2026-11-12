
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

import { createIsland } from './objects/Island.js';
import { createHouse } from './objects/House.js';
import { createRoad } from './objects/Road.js';
import { createTree } from './objects/Tree.js';
import { createPier } from './objects/Pier.js';
import { createLighthouse } from './objects/Lighthouse.js';
import { createBoat } from './objects/Boat.js';

// ① シーン
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ed9f5);

// ② カメラ
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(8, 7, 10);

// ③ レンダラー
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector('#app').appendChild(renderer.domElement);

// ④ 照明
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(5, 10, 5);
scene.add(sunlight);

// ⑤ 島と海
const sea = createIsland(scene);

function updateWaves(elapsed) {
  const positions = sea.geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    // 2方向の波を重ねる
    const wave1 = Math.sin(x * 0.7 + elapsed * 1.5) * 0.07;
    const wave2 = Math.sin(y * 0.5 + elapsed * 1.1) * 0.04;

    // 平面のローカルZ方向へ変形する
    positions.setZ(i, wave1 + wave2);
  }

  // 頂点情報をGPUに再送する
  positions.needsUpdate = true;

  // 光の当たり方を更新
  sea.geometry.computeVertexNormals();
}

// ⑥ 道路
scene.add(createRoad(0, 0, 1.2, 7));
scene.add(createRoad(0, 0, 7, 1.2));

// ⑦ 建物
scene.add(createHouse(-2, -2, 0xffe0b2));
scene.add(createHouse(2, -2, 0xd4e8ff));
scene.add(createHouse(-2, 2, 0xffd6d6));
scene.add(createHouse(2, 2, 0xfff0c2));

// ⑧ 木
scene.add(createTree(-3, -0.9));
scene.add(createTree(-3, 1));
scene.add(createTree(3, -1));
scene.add(createTree(3, 1));

// ⑨ 港の桟橋
scene.add(createPier(4.8, 0));

// ⑩ 灯台
// 灯台を生成して変数に保持
const lighthouse = createLighthouse(3, 3);

// シーンに追加
scene.add(lighthouse);

// ⑪ 船
// 船を生成
const boat = createBoat(6.5, 2);
scene.add(boat);

// 船の基準位置を保存
const boatBaseY = boat.position.y;

// ⑫ カメラ操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.05;
controls.update();

// ⑬ ブラウザサイズ変更対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

//⑭ アニメーション用タイマー
const timer = new THREE.Timer();
timer.connect(document);

// ⑮ 描画ループ
function animate() {
  timer.update();

  const elapsed = timer.getElapsed();

  // ここにアニメーション処理を追加していく
  // 船を上下に揺らす
  boat.position.y = boatBaseY + Math.sin(elapsed * 2) * 0.08;

  // 船を左右に少し傾ける
  boat.rotation.z = Math.sin(elapsed * 1.5) * 0.04;

  // 灯台のライトを回転
  lighthouse.userData.beacon.rotation.y = elapsed * 0.6;

  controls.update();
  renderer.render(scene, camera);
  updateWaves(elapsed);
}

renderer.setAnimationLoop(animate);
