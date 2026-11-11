
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
createIsland(scene);

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
scene.add(createLighthouse(3, 3));

// ⑪ 船
scene.add(createBoat(6.5, 2));

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

// ⑭ 描画ループ
function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
