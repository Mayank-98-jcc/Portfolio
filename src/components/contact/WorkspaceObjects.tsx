import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Shape,
  SphereGeometry,
  TorusGeometry,
} from 'three';

export function WorkspaceObjects({ compact }: { compact: boolean }) {
  const leaves = useRef<InstancedMesh>(null);
  const resources = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.4, -0.5);
    shape.lineTo(0.4, -0.5);
    shape.quadraticCurveTo(0.5, -0.5, 0.5, -0.4);
    shape.lineTo(0.5, 0.4);
    shape.quadraticCurveTo(0.5, 0.5, 0.4, 0.5);
    shape.lineTo(-0.4, 0.5);
    shape.quadraticCurveTo(-0.5, 0.5, -0.5, 0.4);
    shape.lineTo(-0.5, -0.4);
    shape.quadraticCurveTo(-0.5, -0.5, -0.4, -0.5);
    const cushion = new ExtrudeGeometry(shape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
      curveSegments: 4,
    });
    cushion.translate(0, 0, -0.4);
    return {
      cushion,
      box: new BoxGeometry(),
      cylinder: new CylinderGeometry(1, 1, 1, 24),
      sphere: new SphereGeometry(1, 12, 8),
      handle: new TorusGeometry(0.065, 0.014, 6, 16),
      leather: new MeshStandardMaterial({ color: '#211b17', roughness: 0.46 }),
      bronze: new MeshStandardMaterial({ color: '#68513b', metalness: 0.75, roughness: 0.3 }),
      stone: new MeshStandardMaterial({ color: '#453a30', roughness: 0.38, metalness: 0.15 }),
      laptop: new MeshStandardMaterial({ color: '#2a2927', metalness: 0.7, roughness: 0.3 }),
      screen: new MeshStandardMaterial({
        color: '#232b30',
        emissive: '#506166',
        emissiveIntensity: 0.15,
        roughness: 0.2,
      }),
      ceramic: new MeshStandardMaterial({ color: '#e8d7b9', roughness: 0.3 }),
      leaf: new MeshStandardMaterial({ color: '#514c28', roughness: 0.85 }),
      trunk: new MeshStandardMaterial({ color: '#4d3521', roughness: 0.9 }),
      soil: new MeshStandardMaterial({ color: '#15100c', roughness: 1 }),
    };
  }, []);
  useEffect(
    () => () => Object.values(resources).forEach((resource) => resource.dispose()),
    [resources],
  );
  const count = compact ? 22 : 46;
  useLayoutEffect(() => {
    const mesh = leaves.current;
    const transform = new Object3D();
    for (let i = 0; i < count; i++) {
      const angle = i * 2.4;
      const height = 0.85 + (i / count) * 1.2;
      const reach = Math.sin((i / count) * Math.PI) * 0.55 + 0.1;
      transform.position.set(
        -1.7 + Math.cos(angle) * reach,
        height,
        0.45 + Math.sin(angle) * reach * 0.55,
      );
      transform.rotation.set(Math.sin(angle) * 0.7, angle, Math.cos(angle) * 0.8);
      transform.scale.set(0.085, 0.21, 0.025);
      transform.updateMatrix();
      leaves.current?.setMatrixAt(i, transform.matrix);
    }
    if (leaves.current) leaves.current.instanceMatrix.needsUpdate = true;
    return () => {
      mesh?.dispose();
    };
  }, [count]);
  return (
    <group dispose={null}>
      <group position={[-0.85, 0.17, 1.05]} rotation={[0, -0.32, 0]}>
        <mesh
          geometry={resources.cylinder}
          material={resources.bronze}
          position={[0, 0.07, 0]}
          scale={[0.43, 0.055, 0.43]}
          castShadow
        />
        <mesh
          geometry={resources.cylinder}
          material={resources.bronze}
          position={[0, 0.3, 0]}
          scale={[0.06, 0.45, 0.06]}
        />
        <mesh
          geometry={resources.cushion}
          material={resources.leather}
          position={[0, 0.56, 0]}
          scale={[0.87, 0.19, 0.78]}
          castShadow
        />
        <mesh
          geometry={resources.cushion}
          material={resources.leather}
          position={[0, 1.02, -0.35]}
          rotation={[-0.2, 0, 0]}
          scale={[0.9, 0.78, 0.17]}
          castShadow
        />
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            geometry={resources.cushion}
            material={resources.leather}
            position={[side * 0.5, 0.77, 0.02]}
            scale={[0.13, 0.22, 0.7]}
            castShadow
          />
        ))}
      </group>
      <group position={[0.45, 0.17, 1.55]}>
        <mesh
          geometry={resources.cylinder}
          material={resources.stone}
          position={[0, 0.25, 0]}
          scale={[0.35, 0.5, 0.28]}
          castShadow
        />
        <mesh
          geometry={resources.cylinder}
          material={resources.stone}
          position={[0, 0.55, 0]}
          scale={[0.9, 0.11, 0.65]}
          castShadow
          receiveShadow
        />
        <group position={[-0.05, 0.63, -0.03]} rotation={[0, -0.14, 0]}>
          <mesh
            geometry={resources.box}
            material={resources.laptop}
            scale={[0.65, 0.025, 0.43]}
            castShadow
          />
          <group position={[0, 0.21, -0.22]} rotation={[-0.18, 0, 0]}>
            <mesh
              geometry={resources.box}
              material={resources.laptop}
              scale={[0.65, 0.42, 0.025]}
              castShadow
            />
            <mesh
              geometry={resources.box}
              material={resources.screen}
              position={[0, 0, 0.015]}
              scale={[0.6, 0.37, 0.003]}
            />
          </group>
        </group>
        <mesh
          geometry={resources.cylinder}
          material={resources.ceramic}
          position={[0.55, 0.61, 0.14]}
          scale={[0.16, 0.02, 0.16]}
        />
        <mesh
          geometry={resources.cylinder}
          material={resources.ceramic}
          position={[0.55, 0.71, 0.14]}
          scale={[0.09, 0.17, 0.09]}
          castShadow
        />
        <mesh
          geometry={resources.cylinder}
          material={resources.soil}
          position={[0.55, 0.798, 0.14]}
          scale={[0.073, 0.002, 0.073]}
        />
        <mesh
          geometry={resources.handle}
          material={resources.ceramic}
          position={[0.65, 0.72, 0.14]}
        />
      </group>
      <mesh
        geometry={resources.cylinder}
        material={resources.bronze}
        position={[-1.7, 0.43, 0.45]}
        scale={[0.25, 0.66, 0.25]}
        castShadow
      />
      <mesh
        geometry={resources.cylinder}
        material={resources.soil}
        position={[-1.7, 0.766, 0.45]}
        scale={[0.23, 0.005, 0.23]}
      />
      <mesh
        geometry={resources.cylinder}
        material={resources.trunk}
        position={[-1.7, 1.35, 0.45]}
        scale={[0.018, 1.3, 0.018]}
      />
      <instancedMesh ref={leaves} args={[resources.sphere, resources.leaf, count]} castShadow />
    </group>
  );
}
