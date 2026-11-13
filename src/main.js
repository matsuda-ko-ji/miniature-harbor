
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

// ========================================
// ① シーン・カメラ・レンダラー
// ========================================

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
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.querySelector('#app').appendChild(renderer.domElement);

// ========================================
// ② 光源
// ========================================

// 環境光
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  1.5
);
scene.add(ambientLight);

// 太陽光
const sunlight = new THREE.DirectionalLight(
  0xffffff,
  2
);

sunlight.position.set(5, 10, 5);
sunlight.castShadow = true;

// 影の解像度
sunlight.shadow.mapSize.width = 2048;
sunlight.shadow.mapSize.height = 2048;

// 影を描画する範囲
sunlight.shadow.camera.left = -12;
sunlight.shadow.camera.right = 12;
sunlight.shadow.camera.top = 12;
sunlight.shadow.camera.bottom = -12;

sunlight.shadow.camera.near = 0.5;
sunlight.shadow.camera.far = 50;

sunlight.shadow.bias = -0.0001;

scene.add(sunlight);

// ========================================
// ③ 時間帯ごとの設定
// ========================================

const timePresets = {
  day: {
    skyColor: 0x9ed9f5,
    ambientColor: 0xffffff,
    ambientIntensity: 1.5,
    sunColor: 0xffffff,
    sunIntensity: 2,
    sunPosition: [5, 10, 5],
    oceanDeep: 0x176b9b,
    oceanShallow: 0x48b6c8,
    houseLightIntensity: 0,
    beaconIntensity: 8,
    beaconOpacity: 0.015
  },

  sunset: {
    skyColor: 0xf4a477,
    ambientColor: 0xffd6b0,
    ambientIntensity: 0.9,
    sunColor: 0xff954f,
    sunIntensity: 1.6,
    sunPosition: [-8, 3, 4],
    oceanDeep: 0x454c82,
    oceanShallow: 0xb77b83,
    houseLightIntensity: 0.3,
    beaconIntensity: 25,
    beaconOpacity: 0.07
  },

  night: {
    skyColor: 0x101d38,
    ambientColor: 0x7799cc,
    ambientIntensity: 0.35,
    sunColor: 0x6688bb,
    sunIntensity: 0.12,
    sunPosition: [-5, 7, -5],
    oceanDeep: 0x071a36,
    oceanShallow: 0x163d62,
    houseLightIntensity: 0.7,
    beaconIntensity: 50,
    beaconOpacity: 0.16
  }
};

// ========================================
// ④ 3Dオブジェクトの配置
// ========================================

// 島
createIsland(scene);

// 海
const ocean = createOcean();
scene.add(ocean);

// 道路
scene.add(createRoad(0, 0, 1.2, 7));
scene.add(createRoad(0, 0, 7, 1.2));

// 建物
const houses = [
  createHouse(-2, -2, 0xffe0b2),
  createHouse(2, -2, 0xd4e8ff),
  createHouse(-2, 2, 0xffd6d6),
  createHouse(2, 2, 0xfff0c2)
];

for (const house of houses) {
  scene.add(house);
}

// 木
scene.add(createTree(-3.3, -0.9, 'pine'));
scene.add(createTree(-3.3, 0.9, 'broadleaf'));
scene.add(createTree(3.3, -0.9, 'broadleaf'));
scene.add(createTree(3.3, 0.9, 'pine'));

// 草・花・低木・石
const landscape = createLandscape(12345);
scene.add(landscape);

// 桟橋
scene.add(createPier(4.8, 0));

// 灯台
const lighthouse = createLighthouse(3.5, 3.5);

// ドアを島の内側へ向ける
lighthouse.rotation.y = Math.PI;

scene.add(lighthouse);

// 船
const boat = createBoat(6.5, 2);
scene.add(boat);

// 船の基準位置を保持
const boatBaseY = boat.position.y;

// ========================================
// ⑤ カメラ操作
// ========================================

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.05;
controls.update();

// ブラウザサイズ変更対応
window.addEventListener('resize', () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});

// ========================================
// ⑥ アニメーション用タイマー
// ========================================

const timer = new THREE.Timer();
timer.connect(document);

// ========================================
// ⑦ 建物の照明制御
// ========================================

function updateHouseLighting(intensity) {
  for (const house of houses) {
    const porchLight = house.userData.porchLight;
    const lampMaterial = house.userData.lampGlassMaterial;
    const windowMaterial = house.userData.windowMaterial;

    // 玄関灯の明るさ
    porchLight.intensity = intensity;

    // 玄関灯のガラスを発光
    lampMaterial.emissiveIntensity = intensity * 0.8;

    // 窓の発光
    windowMaterial.emissiveIntensity = intensity * 1.0;
  }
}

// ========================================
// ⑧ 時間帯の切り替え
// ========================================

let targetTimeOfDay = 'day';
let currentHouseLightIntensity = 0;

// 灯台のSpotLight
const beaconLight = lighthouse.userData.beacon.children.find(
  (object) => object.isSpotLight
);

// 時間帯を選択する
function changeTimeOfDay(timeOfDay) {
  if (!timePresets[timeOfDay]) {
    console.warn(`Unknown time of day: ${timeOfDay}`);
    return;
  }

  targetTimeOfDay = timeOfDay;

  // ボタンの選択状態
  document.querySelectorAll('.time-button').forEach((button) => {
    const isActive = button.dataset.time === timeOfDay;

    button.classList.toggle('active', isActive);
    button.setAttribute(
      'aria-pressed',
      String(isActive)
    );
  });
}

// 時間帯に応じて徐々に色や明るさを変更
function updateTimeOfDay(delta) {
  const preset = timePresets[targetTimeOfDay];

  // 補間率
  const factor = 1 - Math.exp(-2.5 * delta);

  // 空の色
  scene.background.lerp(
    new THREE.Color(preset.skyColor),
    factor
  );

  // 環境光
  ambientLight.color.lerp(
    new THREE.Color(preset.ambientColor),
    factor
  );

  ambientLight.intensity = THREE.MathUtils.lerp(
    ambientLight.intensity,
    preset.ambientIntensity,
    factor
  );

  // 太陽光
  sunlight.color.lerp(
    new THREE.Color(preset.sunColor),
    factor
  );

  sunlight.intensity = THREE.MathUtils.lerp(
    sunlight.intensity,
    preset.sunIntensity,
    factor
  );

  sunlight.position.lerp(
    new THREE.Vector3(...preset.sunPosition),
    factor
  );

  // 海の色
  ocean.material.uniforms.uDeepColor.value.lerp(
    new THREE.Color(preset.oceanDeep),
    factor
  );

  ocean.material.uniforms.uShallowColor.value.lerp(
    new THREE.Color(preset.oceanShallow),
    factor
  );

  // 建物の照明
  currentHouseLightIntensity = THREE.MathUtils.lerp(
    currentHouseLightIntensity,
    preset.houseLightIntensity,
    factor
  );

  updateHouseLighting(currentHouseLightIntensity);

  // 灯台の光源
  if (beaconLight) {
    beaconLight.intensity = THREE.MathUtils.lerp(
      beaconLight.intensity,
      preset.beaconIntensity,
      factor
    );
  }

  // 灯台のビーム
  const beamMaterial = lighthouse.userData.beamMaterial;

  beamMaterial.opacity = THREE.MathUtils.lerp(
    beamMaterial.opacity,
    preset.beaconOpacity,
    factor
  );
}

// ========================================
// ⑨ 時間帯切り替えUI
// ========================================

const timePanel = document.createElement('div');
timePanel.className = 'time-panel';

timePanel.innerHTML = `
  <div class="time-panel-title">時間帯を変更</div>

  <div class="time-button-group">
    <button
      class="time-button"
      data-time="day"
      type="button"
    >☀️ 昼</button>

    <button
      class="time-button"
      data-time="sunset"
      type="button"
    >🌇 夕方</button>

    <button
      class="time-button"
      data-time="night"
      type="button"
    >🌙 夜</button>
  </div>
`;

document.body.appendChild(timePanel);

// ボタンクリックイベント
document.querySelectorAll('.time-button').forEach((button) => {
  button.addEventListener('click', () => {
    changeTimeOfDay(button.dataset.time);
  });
});

// 初期時間帯
changeTimeOfDay('day');

// ========================================
// ⑩ アニメーションループ
// ========================================

function animate() {
  timer.update();

  const elapsed = timer.getElapsed();
  const delta = timer.getDelta();

  // 船の上下運動
  boat.position.y =
    boatBaseY + Math.sin(elapsed * 2) * 0.08;

  // 船の傾き
  boat.rotation.z =
    Math.sin(elapsed * 1.5) * 0.04;

  // 灯台のライトを回転
  lighthouse.userData.beacon.rotation.y =
    elapsed * 0.6;

  // 海の波を更新
  ocean.userData.uniforms.uTime.value = elapsed;

  // 時間帯を滑らかに変更
  updateTimeOfDay(delta);

  // カメラ操作
  controls.update();

  // 描画
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
