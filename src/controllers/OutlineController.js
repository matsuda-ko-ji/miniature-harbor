import * as THREE from 'three';

import { EffectComposer } from
  'three/addons/postprocessing/EffectComposer.js';

import { RenderPass } from
  'three/addons/postprocessing/RenderPass.js';

import { OutlinePass } from
  'three/addons/postprocessing/OutlinePass.js';

import { OutputPass } from
  'three/addons/postprocessing/OutputPass.js';

/**
 * 選択した3Dオブジェクトの輪郭を描画する
 */
export function createOutlineController({
  renderer,
  scene,
  camera
}) {
  // ========================================
  // ① EffectComposer
  // ========================================

  const composer = new EffectComposer(renderer);

  composer.setPixelRatio(renderer.getPixelRatio());

  composer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  // ========================================
  // ② 通常のシーン描画
  // ========================================

  const renderPass = new RenderPass(
    scene,
    camera
  );

  composer.addPass(renderPass);

  // ========================================
  // ③ 輪郭表示
  // ========================================

  const outlinePass = new OutlinePass(
    new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ),
    scene,
    camera
  );

  // 輪郭の強さ
  outlinePass.edgeStrength = 4;

  // 輪郭の太さ
  outlinePass.edgeThickness = 2;

  // 光のにじみ
  outlinePass.edgeGlow = 0.5;

  // 表示されている輪郭の色
  outlinePass.visibleEdgeColor.set(0xffe066);

  // ほかの物体の陰に隠れた輪郭の色
  outlinePass.hiddenEdgeColor.set(0x59421a);

  // 最初は選択対象なし
  outlinePass.selectedObjects = [];

  // 選択されるまでは輪郭処理を無効にする
  outlinePass.enabled = false;

  composer.addPass(outlinePass);

  // ========================================
  // ④ 最終的な画面への出力
  // ========================================

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // ========================================
  // ⑤ 選択対象の変更
  // ========================================

  function select(object) {
    if (object) {
      outlinePass.selectedObjects = [object];
      outlinePass.enabled = true;
    } else {
      outlinePass.selectedObjects = [];
      outlinePass.enabled = false;
    }
  }

  // ========================================
  // ⑥ 描画処理
  // ========================================

  function render(delta) {
    composer.render(delta);
  }

  // ========================================
  // ⑦ 画面サイズ変更対応
  // ========================================

  function resize(width, height) {
    composer.setSize(width, height);
  }

  // ========================================
  // ⑧ 後片付け
  // ========================================

  function dispose() {
    composer.dispose();
  }

  return {
    select,
    render,
    resize,
    dispose
  };
}
