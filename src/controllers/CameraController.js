import * as THREE from 'three';

/**
 * カメラの自動移動を管理する
 */
export function createCameraController({
  camera,
  controls
}) {
  // ========================================
  // ① カメラ移動の設定
  // ========================================

  const duration = 1.2;

  // 初期位置と初期注視点
  const initialPosition = camera.position.clone();
  const initialTarget = controls.target.clone();

  // 移動開始時
  const startPosition = new THREE.Vector3();
  const startTarget = new THREE.Vector3();

  // 移動終了時
  const endPosition = new THREE.Vector3();
  const endTarget = new THREE.Vector3();

  // 移動方向
  const direction = new THREE.Vector3();

  let elapsed = 0;
  let isMoving = false;

  // ========================================
  // ② 共通の移動開始処理
  // ========================================

  function startMove(position, target) {
    // 現在位置を保存
    startPosition.copy(camera.position);
    startTarget.copy(controls.target);

    // 移動先を保存
    endPosition.copy(position);
    endTarget.copy(target);

    elapsed = 0;
    isMoving = true;
  }

  // ========================================
  // ③ オブジェクトへのフォーカス
  // ========================================

  function focus(object, distance = 5, height = 0.8) {
    if (!object) return;

    // 対象のワールド座標
    const target = new THREE.Vector3();
    object.getWorldPosition(target);

    // 対象の中心付近を見る
    target.y += height;

    // 現在のカメラ方向を取得
    direction.subVectors(
      camera.position,
      controls.target
    );

    if (direction.lengthSq() < 0.0001) {
      direction.set(1, 0.7, 1);
    }

    direction.normalize();

    // 移動先
    const position = target.clone().addScaledVector(
      direction,
      distance
    );

    startMove(position, target);
  }

  // ========================================
  // ④ 全体表示へ戻る
  // ========================================

  function reset() {
    startMove(initialPosition, initialTarget);
  }

  // ========================================
  // ⑤ カメラ移動の更新
  // ========================================

  function update(delta) {
    if (!isMoving) return;

    elapsed += delta;

    const progress = THREE.MathUtils.clamp(
      elapsed / duration,
      0,
      1
    );

    // Smoothstepイージング
    const eased =
      progress * progress * (3 - 2 * progress);

    camera.position.lerpVectors(
      startPosition,
      endPosition,
      eased
    );

    controls.target.lerpVectors(
      startTarget,
      endTarget,
      eased
    );

    if (progress >= 1) {
      isMoving = false;
    }
  }

  // ========================================
  // ⑥ 手動操作時は自動移動を中断
  // ========================================

  function cancel() {
    isMoving = false;
  }

  controls.addEventListener('start', cancel);

  // ========================================
  // ⑦ 後片付け
  // ========================================

  function dispose() {
    controls.removeEventListener('start', cancel);
  }

  return {
    focus,
    reset,
    update,
    cancel,
    dispose
  };
}
