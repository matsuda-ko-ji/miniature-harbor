import * as THREE from 'three';

/**
 * 3Dオブジェクトのクリック判定を管理する
 *
 * @param {Object} options
 */
export function createInteractionController({
  camera,
  renderer,
  targets,
  onSelect
}) {
  // レイキャスター
  const raycaster = new THREE.Raycaster();

  // マウス座標
  const pointer = new THREE.Vector2();

  // クリック判定対象の3Dオブジェクト
  const objects = targets.map((target) => target.object);

  // ドラッグとクリックを区別するための記録
  let pointerStart = null;

  // ========================================
  // ① マウスを押した位置を記録
  // ========================================

  function onPointerDown(event) {
    // 左クリックまたはタッチ操作のみ受け付ける
    if (!event.isPrimary || event.button !== 0) {
      return;
    }

    pointerStart = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId
    };
  }

  // ========================================
  // ② マウスを離したときに判定
  // ========================================

  function onPointerUp(event) {
    if (
      !pointerStart ||
      event.pointerId !== pointerStart.pointerId
    ) {
      return;
    }

    const distance = Math.hypot(
      event.clientX - pointerStart.x,
      event.clientY - pointerStart.y
    );

    pointerStart = null;

    // 6px以上移動した場合はカメラ操作とみなす
    if (distance > 6) {
      return;
    }

    // ======================================
    // ③ マウス座標をThree.js用に変換
    // ======================================

    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    pointer.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // カメラからレイを生成
    raycaster.setFromCamera(pointer, camera);

    // 子オブジェクトも含めて交差判定
    const intersects = raycaster.intersectObjects(
      objects,
      true
    );

    // 何もクリックしていない場合
    if (intersects.length === 0) {
      onSelect(null);
      return;
    }

    // ======================================
    // ④ クリックされた対象を特定
    // ======================================

    let selectedObject = intersects[0].object;

    // Meshの親をたどって対象のGroupを探す
    while (
      selectedObject &&
      !objects.includes(selectedObject)
    ) {
      selectedObject = selectedObject.parent;
    }

    const selectedTarget = targets.find(
      (target) => target.object === selectedObject
    );

    onSelect(selectedTarget ?? null);
  }

  function onPointerCancel() {
    pointerStart = null;
  }

  // ========================================
  // ⑤ イベントを登録
  // ========================================

  const canvas = renderer.domElement;

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);

  // ========================================
  // ⑥ 後片付け用の処理
  // ========================================

  function dispose() {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerCancel);
  }

  return {
    dispose
  };
}
