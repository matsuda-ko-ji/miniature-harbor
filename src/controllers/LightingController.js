
import * as THREE from 'three';

/**
 * 時間帯に応じた照明・色の制御
 *
 * @param {Object} options - 制御に必要なオブジェクト
 * @returns {Object} update()を持つコントローラー
 */
export function createLightingController({
  scene,
  ambientLight,
  sunlight,
  ocean,
  houses,
  lighthouse,
  timePresets
}) {
  // ========================================
  // ① 制御に使用する変数
  // ========================================

  let currentHouseLightIntensity = 0;

  const beaconLight = lighthouse.userData.beacon.children.find(
    (object) => object.isSpotLight
  );

  const beamMaterial = lighthouse.userData.beamMaterial;

  // 色と位置は最初に一度だけ生成する
  const preparedPresets = Object.fromEntries(
    Object.entries(timePresets).map(([name, preset]) => [
      name,
      {
        ...preset,
        skyColorValue: new THREE.Color(preset.skyColor),
        ambientColorValue: new THREE.Color(preset.ambientColor),
        sunColorValue: new THREE.Color(preset.sunColor),
        sunPositionValue: new THREE.Vector3(...preset.sunPosition),
        oceanDeepValue: new THREE.Color(preset.oceanDeep),
        oceanShallowValue: new THREE.Color(preset.oceanShallow)
      }
    ])
  );

  // ========================================
  // ② 建物の照明制御
  // ========================================

  function updateHouseLighting(intensity) {
    for (const house of houses) {
      const porchLight = house.userData.porchLight;
      const lampMaterial = house.userData.lampGlassMaterial;
      const windowMaterial = house.userData.windowMaterial;

      // 玄関灯
      porchLight.intensity = intensity;

      // 玄関灯のガラス
      lampMaterial.emissiveIntensity = intensity * 0.8;

      // 窓の発光
      windowMaterial.emissiveIntensity = intensity * 1.0;
    }
  }

  // ========================================
  // ③ 時間帯に応じた照明制御
  // ========================================

  function update(delta, timeOfDay) {
    const preset = preparedPresets[timeOfDay];

    if (!preset) {
      return;
    }

    // 補間率
    const factor = 1 - Math.exp(-2.5 * delta);

    // 空
    scene.background.lerp(
      preset.skyColorValue,
      factor
    );

    // 環境光
    ambientLight.color.lerp(
      preset.ambientColorValue,
      factor
    );

    ambientLight.intensity = THREE.MathUtils.lerp(
      ambientLight.intensity,
      preset.ambientIntensity,
      factor
    );

    // 太陽光
    sunlight.color.lerp(
      preset.sunColorValue,
      factor
    );

    sunlight.intensity = THREE.MathUtils.lerp(
      sunlight.intensity,
      preset.sunIntensity,
      factor
    );

    sunlight.position.lerp(
      preset.sunPositionValue,
      factor
    );

    // 海の色
    ocean.material.uniforms.uDeepColor.value.lerp(
      preset.oceanDeepValue,
      factor
    );

    ocean.material.uniforms.uShallowColor.value.lerp(
      preset.oceanShallowValue,
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
    beamMaterial.opacity = THREE.MathUtils.lerp(
      beamMaterial.opacity,
      preset.beaconOpacity,
      factor
    );
  }

  // ========================================
  // ④ 公開する処理
  // ========================================

  return {
    update
  };
}
