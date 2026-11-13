
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
import { createLandscape } from './objects/Landscape.js';
import { createOcean } from './objects/Ocean.js';

// シーン
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ed9f5);

// カメラ
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(8, 7, 10);

// レンダラー
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.querySelector('#app').appendChild(renderer.domElement);

// 照明
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(5, 10, 5);
sunlight.castShadow = true;

sunlight.shadow.mapSize.width = 2048;
sunlight.shadow.mapSize.height = 2048;

sunlight.shadow.camera.left = -12;
sunlight.shadow.camera.right = 12;
sunlight.shadow.camera.top = 12;
sunlight.shadow.camera.bottom = -12;

sunlight.shadow.camera.near = 0.5;
sunlight.shadow.camera.far = 50;

sunlight.shadow.bias = -0.0001;
scene.add(sunlight);

// 島と海
// 島を作成
createIsland(scene);

// シェーダーを使った海を作成
const ocean = createOcean();
scene.add(ocean);

// 道路
scene.add(createRoad(0, 0, 1.2, 7));
scene.add(createRoad(0, 0, 7, 1.2));

// 建物
scene.add(createHouse(-2, -2, 0xffe0b2));
scene.add(createHouse(2, -2, 0xd4e8ff));
scene.add(createHouse(-2, 2, 0xffd6d6));
scene.add(createHouse(2, 2, 0xfff0c2));

// 木
scene.add(createTree(-3.3, -0.9, 'pine'));
scene.add(createTree(-3.3, 0.9, 'broadleaf'));
scene.add(createTree(3.3, -0.9, 'broadleaf'));
scene.add(createTree(3.3, 0.9, 'pine'));


// 草・花・低木・石
const landscape = createLandscape(12345);
scene.add(landscape);

// 港の桟橋
scene.add(createPier(4.8, 0));

// 灯台
const lighthouse = createLighthouse(3.5, 3.5);

// ドアを島の中心方向へ向ける
lighthouse.rotation.y = Math.PI;

scene.add(lighthouse);

// シーンに追加
scene.add(lighthouse);

// 船
// 船を生成
const boat = createBoat(6.5, 2);
scene.add(boat);

// 船の基準位置を保存
const boatBaseY = boat.position.y;

// カメラ操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.05;
controls.update();

// ブラウザサイズ変更対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーション用タイマー
const timer = new THREE.Timer();
timer.connect(document);

// 描画ループ
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
  // GPUのシェーダーへ経過時間を渡す
  ocean.userData.uniforms.uTime.value = elapsed;
}

renderer.setAnimationLoop(animate);
