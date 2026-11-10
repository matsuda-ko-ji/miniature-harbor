
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

// ① シーンを作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ed9f5);

// ② カメラを作成
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(8, 7, 10);

// ③ レンダラーを作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector('#app').appendChild(renderer.domElement);

// ④ 光源を設定
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(5, 10, 5);
scene.add(sunlight);

// ⑤ 島の土台を作成
const islandGeometry = new THREE.BoxGeometry(8, 1, 8);
const islandMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b6345
});

const island = new THREE.Mesh(islandGeometry, islandMaterial);
island.position.y = -0.5;
scene.add(island);

// ⑥ 島の草地を作成
const grassGeometry = new THREE.BoxGeometry(8, 0.2, 8);
const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x69ae61
});

const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.position.y = 0.1;
scene.add(grass);

// ⑦ 海を作成
const seaGeometry = new THREE.PlaneGeometry(200, 200);
const seaMaterial = new THREE.MeshStandardMaterial({
  color: 0x338fc2,
  roughness: 0.5,
  metalness: 0.1
});

const sea = new THREE.Mesh(seaGeometry, seaMaterial);
sea.rotation.x = -Math.PI / 2;
sea.position.y = -1.2;
scene.add(sea);

// ⑧ マウスでカメラを操作できるようにする
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.05;
controls.update();

// ⑨ ブラウザのサイズ変更に対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ⑩ アニメーションループ
function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
