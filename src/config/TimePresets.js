
/**
 * 時間帯ごとの表示設定
 *
 * day    : 昼
 * sunset : 夕方
 * night  : 夜
 */

export const timePresets = {
  // ========================================
  // 昼
  // ========================================
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

  // ========================================
  // 夕方
  // ========================================
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

  // ========================================
  // 夜
  // ========================================
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
