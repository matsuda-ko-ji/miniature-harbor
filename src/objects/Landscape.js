
import * as THREE from 'three';

// シード付き乱数生成器
function createRandom(seed) {
  let state = seed >>> 0;

  return function () {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createLandscape(seed = 12345) {
  const landscape = new THREE.Group();
  const random = createRandom(seed);

  // マテリアル
  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e944d,
    roughness: 1
  });

  const flowerMaterials = [
    0xffd966,
    0xffa7c4,
    0xffffff
  ].map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9
  }));

  const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x3c8745
  });

  const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x4b8e49,
    roughness: 0.95,
    flatShading: true
  });

  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x99978f,
    roughness: 1,
    flatShading: true
  });

  // 共通ジオメトリ
  const grassGeometry = new THREE.ConeGeometry(0.045, 0.16, 3);
  const stemGeometry = new THREE.CylinderGeometry(0.012, 0.015, 0.18, 5);
  const flowerGeometry = new THREE.SphereGeometry(0.065, 6, 4);
  const bushGeometry = new THREE.IcosahedronGeometry(0.24, 0);
  const rockGeometry = new THREE.IcosahedronGeometry(0.15, 0);

  // 建物・道路などと重ならない場所を判定
  function canPlace(x, z) {
    // 島の外周から余裕を取る
    if (Math.abs(x) > 3.7 || Math.abs(z) > 3.7) {
      return false;
    }

    // 十字型の道路を避ける
    if (Math.abs(x) < 0.8 || Math.abs(z) < 0.8) {
      return false;
    }

    // 4軒の建物を避ける
    for (const hx of [-2, 2]) {
      for (const hz of [-2, 2]) {
        if (
          Math.abs(x - hx) < 1.0 &&
          Math.abs(z - hz) < 1.0
        ) {
          return false;
        }
      }
    }

    // 灯台を避ける
    if (Math.hypot(x - 3.5, z - 3.5) < 0.8) {
      return false;
    }

    return true;
  }

  // 配置可能なランダム座標を取得
  function getPosition() {
    for (let i = 0; i < 500; i++) {
      const x = (random() - 0.5) * 7.4;
      const z = (random() - 0.5) * 7.4;

      if (canPlace(x, z)) {
        return { x, z };
      }
    }

    return null;
  }

  // ① 草を80本配置
  for (let i = 0; i < 80; i++) {
    const pos = getPosition();
    if (!pos) break;

    const grass = new THREE.Mesh(
      grassGeometry,
      grassMaterial
    );

    grass.position.set(pos.x, 0.08, pos.z);
    grass.rotation.y = random() * Math.PI * 2;

    const scale = 0.6 + random() * 0.8;
    grass.scale.setScalar(scale);

    landscape.add(grass);
  }

  // ② 花を18本配置
  for (let i = 0; i < 18; i++) {
    const pos = getPosition();
    if (!pos) break;

    const flower = new THREE.Group();

    const stem = new THREE.Mesh(
      stemGeometry,
      stemMaterial
    );
    stem.position.y = 0.09;
    flower.add(stem);

    const blossom = new THREE.Mesh(
      flowerGeometry,
      flowerMaterials[Math.floor(random() * flowerMaterials.length)]
    );
    blossom.position.y = 0.2;
    flower.add(blossom);

    flower.position.set(pos.x, 0, pos.z);
    landscape.add(flower);
  }

  // ③ 低木を8個配置
  for (let i = 0; i < 8; i++) {
    const pos = getPosition();
    if (!pos) break;

    const bush = new THREE.Mesh(
      bushGeometry,
      bushMaterial
    );

    bush.position.set(pos.x, 0.2, pos.z);
    bush.scale.set(1.2, 0.8, 1);

    bush.castShadow = true;
    landscape.add(bush);
  }

  // ④ 石を10個配置
  for (let i = 0; i < 10; i++) {
    const pos = getPosition();
    if (!pos) break;

    const rock = new THREE.Mesh(
      rockGeometry,
      rockMaterial
    );

    rock.position.set(pos.x, 0.09, pos.z);
    rock.rotation.y = random() * Math.PI;

    rock.scale.set(1, 0.6, 0.8);
    rock.castShadow = true;

    landscape.add(rock);
  }

  // 草地の上面へ配置
  landscape.position.y = 0.2;

  return landscape;
}
