
import * as THREE from 'three';

export function createOcean() {
  // ① 波を表現するために平面を細かく分割
  const geometry = new THREE.PlaneGeometry(
    120,
    120,
    240,
    240
  );

  // ② JavaScriptからシェーダーに渡す値
  const uniforms = {
    uTime: { value: 0 },
    uDeepColor: { value: new THREE.Color(0x176b9b) },
    uShallowColor: { value: new THREE.Color(0x48b6c8) }
  };

  // ③ シェーダーマテリアル
  const material = new THREE.ShaderMaterial({
    uniforms,

    vertexShader: `
      uniform float uTime;

      varying float vWaveHeight;
      varying vec2 vUv;

      void main() {
        vec3 pos = position;

        // 2方向の波を重ねる
        float wave1 = sin(
            pos.x * 0.45 + uTime * 0.8
        ) * 0.05;

        float wave2 = sin(
            pos.y * 0.4 + uTime * 0.7
        ) * 0.035;

        // 細かい波
        float wave3 = sin(
            pos.x * 1.2 +
            pos.y * 0.9 +
            uTime * 1.1
        ) * 0.012;

        float waveHeight = wave1 + wave2 + wave3;

        // ローカルZ方向へ変形
        pos.z += waveHeight;

        vWaveHeight = waveHeight;
        vUv = uv;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(pos, 1.0);
      }
    `,

    fragmentShader: `
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;

        varying float vWaveHeight;
        varying vec2 vUv;

        void main() {
            float colorMix = smoothstep(
            -0.18,
            0.18,
            vWaveHeight
            );

            vec3 waterColor = mix(
            uDeepColor,
            uShallowColor,
            colorMix
            );

            // 波の高い部分を少しだけ明るくする
            waterColor += vec3(0.03, 0.04, 0.04) * colorMix;

            gl_FragColor = vec4(waterColor, 1.0);
        }
    `,

    side: THREE.DoubleSide
  });

  // ④ 海面を作成
  const ocean = new THREE.Mesh(geometry, material);

  // PlaneGeometryを水平に回転
  ocean.rotation.x = -Math.PI / 2;

  // 既存の海と同じ高さ
  ocean.position.y = -1.2;

  // 外部から時間を更新できるようにする
  ocean.userData.uniforms = uniforms;

  return ocean;
}
