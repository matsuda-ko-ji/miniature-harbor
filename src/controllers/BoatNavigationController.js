import * as THREE from 'three';

/**
 * 港町の周囲を航行する船のアニメーション
 *
 * @param {Object} options
 * @param {THREE.Object3D} options.boat
 * @param {number} options.speed - 移動速度（ワールド単位/秒）
 */
export function createBoatNavigationController({
  boat,
  speed = 1.4
}) {
  // ========================================
  // ① 航路を定義
  // ========================================

  
const route = new THREE.CatmullRomCurve3(
  [
    // 桟橋から離れた位置を開始点にする
    new THREE.Vector3(9.5, 0, 2),

    // 島の右側から奥側へ
    new THREE.Vector3(9.5, 0, -4),
    new THREE.Vector3(5, 0, -8.5),

    // 島の奥側
    new THREE.Vector3(-5, 0, -8.5),

    // 島の左側
    new THREE.Vector3(-9.5, 0, -4),
    new THREE.Vector3(-9.5, 0, 4),

    // 島の手前側
    new THREE.Vector3(-5, 0, 8.5),
    new THREE.Vector3(5, 0, 8.5),
    new THREE.Vector3(9.5, 0, 5)
  ],
  true,
  'centripetal'
);

  // 曲線長の計算精度を高める
  route.arcLengthDivisions = 500;
  route.updateArcLengths();

  const routeLength = route.getLength();

  // ========================================
  // ② 船の初期状態を保持
  // ========================================

  const baseY = boat.position.y;

  // Boat.jsのモデルの向きに応じて調整する
  const headingOffset = -Math.PI / 2;

  // 移動した距離
  let traveledDistance = 0;

  // 毎フレーム使うVector3を再利用
  const position = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  // ========================================
  // ③ 船の位置と向きを更新
  // ========================================

  function update(delta, elapsed) {
    // 移動距離を加算
    traveledDistance =
      (traveledDistance + speed * delta) % routeLength;

    // 航路全体に対する進行率（0～1）
    const progress = traveledDistance / routeLength;

    // 航路上の位置
    route.getPointAt(progress, position);

    // 航路の進行方向
    route.getTangentAt(progress, tangent);

    // 波による上下運動
    const bobbing = Math.sin(elapsed * 2) * 0.08;

    boat.position.set(
      position.x,
      baseY + bobbing,
      position.z
    );

    // 船首を進行方向に向ける
    boat.rotation.y =
      Math.atan2(tangent.x, tangent.z) + headingOffset;

    // 波による左右の傾き
    boat.rotation.z =
      Math.sin(elapsed * 1.5) * 0.04;
  }

  return {
    update
  };
}
