
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

// 3Dオブジェクト
import { createIsland } from './objects/Island.js';
import { createHouse } from './objects/House.js';
import { createRoad } from './objects/Road.js';
import { createTree } from './objects/Tree.js';
import { createPier } from './objects/Pier.js';
import { createLighthouse } from './objects/Lighthouse.js';
import { createBoat } from './objects/Boat.js';
import { createLandscape } from './objects/Landscape.js';
import { createOcean } from './objects/Ocean.js';
import { createInteractionController } from './controllers/InteractionController.js';
import { createObjectInfoPanel } from './ui/ObjectInfoPanel.js';
import { createOutlineController } from './controllers/OutlineController.js';
import { createCameraController } from './controllers/CameraController.js';
import { createBoatNavigationController } from './controllers/BoatNavigationController.js';

// 時間帯の設定
import { timePresets } from './config/TimePresets.js';

// 照明コントローラー
import { createLightingController } from './controllers/LightingController.js';

// 時間帯切り替えUI
import { createTimeControl } from './ui/TimeControl.js';

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

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

// 影の設定
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// 描画領域をHTMLに追加
document.querySelector('#app').appendChild(
  renderer.domElement
);

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
// ③ 3Dオブジェクトの配置
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
const boat = createBoat(9.5, 2);
scene.add(boat);

// ========================================
// 船の航行コントローラー
// ========================================

const boatNavigationController =
  createBoatNavigationController({
    boat,
    speed: 1.4
  });

// ========================================
// 3Dオブジェクトの情報表示
// ========================================

// 情報パネルを生成
const objectInfoPanel = createObjectInfoPanel(() => {
  outlineController.select(null);
});

// クリックできるオブジェクトを登録
const interactiveTargets = [
  {
    object: houses[0],
    title: '港町の黄色い家',
    description:
      '明るい色合いが特徴の住宅です。夜になると玄関灯と窓が温かく光ります。'
  },
  {
    object: houses[1],
    title: '港町の青い家',
    description:
      '海辺の小さな住宅です。港町の落ち着いた街並みを彩っています。'
  },
  {
    object: houses[2],
    title: '港町のピンクの家',
    description:
      'やさしい色合いの住宅です。街並みに華やかさを加えています。'
  },
  {
    object: houses[3],
    title: '港町のクリーム色の家',
    description:
      '交差点の近くに建つ住宅です。夜には窓から柔らかな光が漏れます。'
  },
  {
    object: lighthouse,
    title: '港の灯台',
    description:
      '港を見守る灯台です。回転する光が海を照らし、夜の港町を演出します。'
  }
];

// Raycasterのクリック判定を開始

createInteractionController({
  camera,
  renderer,
  targets: interactiveTargets,

  onSelect: (target) => {
    if (target) {
      // 情報パネル
      objectInfoPanel.show(target);

      // 輪郭表示
      outlineController.select(target.object);

      // カメラを対象へ移動
      const isLighthouse = target.object === lighthouse;

      cameraController.focus(
        target.object,
        isLighthouse ? 6.5 : 4.5,
        isLighthouse ? 1.4 : 0.7
      );
    } else {
      // 情報パネル・輪郭を解除
      objectInfoPanel.hide();
      outlineController.select(null);

      // 自動移動が残っていれば中断
      cameraController.cancel();
    }
  }
});

// ========================================
// 全体表示に戻るボタン
// ========================================

const resetCameraButton = document.createElement('button');

resetCameraButton.className = 'reset-camera-button';
resetCameraButton.type = 'button';
resetCameraButton.textContent = '⌂ 全体表示に戻る';

document.body.appendChild(resetCameraButton);

// クリック時の処理
resetCameraButton.addEventListener('click', () => {
  // カメラを初期位置へ滑らかに戻す
  cameraController.reset();

  // 選択中の輪郭を解除
  outlineController.select(null);

  // 情報パネルを閉じる
  objectInfoPanel.hide();
});

// ========================================
// ④ 照明コントローラー
// ========================================

const lightingController = createLightingController({
  scene,
  ambientLight,
  sunlight,
  ocean,
  houses,
  lighthouse,
  timePresets
});

// ========================================
// 輪郭表示コントローラー
// ========================================

const outlineController = createOutlineController({
  renderer,
  scene,
  camera
});

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

// ========================================
// カメラ移動コントローラー
// ========================================

// OrbitControlsの初期設定完了後に生成する
const cameraController = createCameraController({
  camera,
  controls
});

// ブラウザサイズ変更対応
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // カメラ
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // レンダラー
  renderer.setSize(width, height);

  // ポストプロセッシング
  outlineController.resize(width, height);
});

// ========================================
// ⑥ アニメーション用タイマー
// ========================================

const timer = new THREE.Timer();
timer.connect(document);

// ========================================
// ⑦ 時間帯の切り替え
// ========================================

// 現在の切り替え先
let targetTimeOfDay = 'day';

/**
 * 時間帯を変更する
 *
 * @param {string} timeOfDay - day / sunset / night
 */
function changeTimeOfDay(timeOfDay) {
  // 存在しない時間帯は受け付けない
  if (!timePresets[timeOfDay]) {
    console.warn(
      `Unknown time of day: ${timeOfDay}`
    );
    return;
  }

  // 切り替え先を更新
  targetTimeOfDay = timeOfDay;

  // UIの選択状態を更新
  timeControl.setActiveTime(timeOfDay);
}

// ========================================
// ⑧ 時間帯切り替えUI
// ========================================

// 時間帯切り替えUIを生成
const timeControl = createTimeControl(
  changeTimeOfDay
);

// 初期状態は昼
changeTimeOfDay('day');

// ========================================
// ⑨ アニメーションループ
// ========================================

function animate() {
  // タイマー更新
  timer.update();

  const elapsed = timer.getElapsed();
  const delta = timer.getDelta();

  // ========================================
  // 船の航行アニメーション
  // ========================================

  boatNavigationController.update(delta, elapsed);

  // ----------------------------------------
  // 灯台のアニメーション
  // ----------------------------------------

  lighthouse.userData.beacon.rotation.y =
    elapsed * 0.6;

  // ----------------------------------------
  // 海のアニメーション
  // ----------------------------------------

  ocean.userData.uniforms.uTime.value =
    elapsed;

  // ----------------------------------------
  // 時間帯に応じた照明制御
  // ----------------------------------------

  lightingController.update(
    delta,
    targetTimeOfDay
  );

  // ----------------------------------------
  // 自動カメラ移動
  // ----------------------------------------
  
  cameraController.update(delta);

  // ----------------------------------------
  // カメラ操作
  // ----------------------------------------

  controls.update();

  // ----------------------------------------
  // 描画
  // ----------------------------------------

  // ポストプロセッシングを使用して描画
  outlineController.render(delta);
}

// ========================================
// ⑩ アニメーションループ開始
// ========================================

renderer.setAnimationLoop(animate);
