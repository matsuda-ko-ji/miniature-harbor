
import * as THREE from 'three';

export function createBoat(x, z) {
  const boat = new THREE.Group();

  // 船体
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5236,
    side: THREE.DoubleSide
  });

  const hullGeometry = new THREE.CylinderGeometry(
    0.35, 0.55, 1.8, 4
  );
  const hull = new THREE.Mesh(hullGeometry, hullMaterial);

  hull.rotation.set(0, Math.PI / 4, Math.PI / 2);
  hull.scale.set(1, 0.65, 1);

  boat.add(hull);

  // マスト
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.055, 2, 8),
    new THREE.MeshStandardMaterial({
      color: 0x69452e
    })
  );

  mast.position.y = 1;
  boat.add(mast);

  // 三角形の帆
  const sailGeometry = new THREE.BufferGeometry();

  const vertices = new Float32Array([
    0, 1.9, 0,
    0, 0.4, 0,
    0.85, 0.4, 0
  ]);

  sailGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(vertices, 3)
  );
  sailGeometry.computeVertexNormals();

  const sailMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff4d6,
    side: THREE.DoubleSide
  });

  const sail = new THREE.Mesh(sailGeometry, sailMaterial);
  boat.add(sail);

  // 船を水面付近に配置
  boat.position.set(x, -1.0, z);

  return boat;
}
