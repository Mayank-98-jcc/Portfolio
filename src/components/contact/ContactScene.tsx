import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BufferAttribute, MeshStandardMaterial, Vector3 } from 'three';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import {
  archGeometry,
  mountainGeometry,
  skyFragment,
  skyVertex,
  stoneTexture,
  wallGeometry,
} from './contactGeometry';
import { WorkspaceObjects } from './WorkspaceObjects';

function Studio({ compact }: { compact: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const dust = useRef<BufferAttribute>(null);
  const lamp = useRef<MeshStandardMaterial>(null);
  const target = useMemo(() => new Vector3(0, 2.65, 0), []);
  const resources = useMemo(() => {
    const texture = stoneTexture();
    return {
      texture,
      arch: archGeometry(),
      wall: wallGeometry(),
      stone: new MeshStandardMaterial({
        color: '#30271f',
        roughness: 0.7,
        metalness: 0.08,
        bumpMap: texture,
        bumpScale: 0.06,
      }),
      mountains: [0, 1, 2].map((i) => mountainGeometry(i, compact)),
      terrain: ['#b7a1a0', '#7a7577', '#414746'].map(
        (color) => new MeshStandardMaterial({ color, vertexColors: true, roughness: 1 }),
      ),
    };
  }, [compact]);
  useEffect(
    () => () => {
      resources.texture.dispose();
      resources.arch.dispose();
      resources.wall.dispose();
      resources.stone.dispose();
      resources.mountains.forEach((geometry) => geometry.dispose());
      resources.terrain.forEach((material) => material.dispose());
    },
    [resources],
  );
  const positions = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: (compact ? 10 : 26) * 3 }, (_, i) =>
          i % 3 === 0
            ? Math.sin(i * 7.3) * 2.5
            : i % 3 === 1
              ? 0.5 + (Math.sin(i * 5.1) + 1) * 2
              : 1 + Math.cos(i * 2.4),
        ),
      ),
    [compact],
  );
  const animated = useMemo(() => positions.slice(), [positions]);
  useEffect(() => {
    const element = document.getElementById('contact');
    const fine = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
    const reset = () => {
      pointer.current.x = pointer.current.y = 0;
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse' || !element) return;
      const bounds = element.getBoundingClientRect();
      pointer.current.x = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
      );
      pointer.current.y = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
      );
    };
    element?.addEventListener('pointermove', move, { passive: true });
    element?.addEventListener('pointerleave', reset);
    fine.addEventListener('change', reset);
    window.addEventListener('resize', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      element?.removeEventListener('pointermove', move);
      element?.removeEventListener('pointerleave', reset);
      fine.removeEventListener('change', reset);
      window.removeEventListener('resize', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, []);
  useFrame(({ camera, gl }, delta) => {
    const step = Math.min(delta, 0.05);
    time.current += step;
    const ease = 1 - Math.exp(-step * 2.6);
    camera.position.x += (pointer.current.x * 0.24 - camera.position.x) * ease;
    camera.position.y += (3.05 - pointer.current.y * 0.13 - camera.position.y) * ease;
    camera.lookAt(target);
    if (lamp.current) lamp.current.emissiveIntensity = 1.25 + Math.sin(time.current * 0.32) * 0.055;
    if (dust.current) {
      for (let i = 0; i < positions.length / 3; i++)
        dust.current.setY(i, positions[i * 3 + 1] + Math.sin(time.current * 0.13 + i) * 0.065);
      dust.current.needsUpdate = true;
    }
    if (!gl.domElement.dataset.rendered) gl.domElement.dataset.rendered = 'true';
  });
  return (
    <>
      <hemisphereLight color="#fce3bd" groundColor="#211812" intensity={0.65} />
      <directionalLight
        position={[-3, 6, 5]}
        color="#ffe0b3"
        intensity={2.8}
        castShadow={!compact}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={6}
        shadow-camera-bottom={-2}
        shadow-bias={-0.001}
      />
      <directionalLight position={[3, 5, -4]} color="#ffab5b" intensity={3} />
      <pointLight
        position={[1.6, 0.65, 1.2]}
        color="#ff963e"
        intensity={7}
        distance={4}
        decay={2}
      />
      <fog attach="fog" args={['#18100d', 14, 30]} />
      <mesh position={[0, 3.2, -6]}>
        <planeGeometry args={[22, 14]} />
        <shaderMaterial
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[1.0, 3.2, -5.6]}>
        <sphereGeometry args={[0.24, 24, 16]} />
        <meshBasicMaterial color="#fff1bf" toneMapped={false} />
      </mesh>
      {resources.mountains.map((geometry, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={resources.terrain[i]}
          position={[0, 0.7 - i * 0.35, -5 + i * 0.8]}
          dispose={null}
        />
      ))}
      <mesh
        geometry={resources.wall}
        material={resources.stone}
        position={[0, 0, -0.42]}
        dispose={null}
        receiveShadow
      />
      <mesh
        geometry={resources.arch}
        material={resources.stone}
        dispose={null}
        castShadow
        receiveShadow
      />
      <group position={[0, 3.35, 0.47]}>
        <mesh>
          <torusGeometry args={[2.14, 0.008, 6, 64, Math.PI]} />
          <meshBasicMaterial color="#ffab61" toneMapped={false} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 2.14, -1.68, 0]}>
            <boxGeometry args={[0.013, 3.35, 0.012]} />
            <meshBasicMaterial color="#ffad66" toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 2]} receiveShadow>
        <planeGeometry args={[20, 18]} />
        <meshStandardMaterial
          color="#29221b"
          roughness={0.24}
          metalness={0.5}
          bumpMap={resources.texture}
          bumpScale={0.025}
        />
      </mesh>
      <mesh position={[0, 0.08, 1]} receiveShadow castShadow>
        <cylinderGeometry args={[2.7, 2.78, 0.18, compact ? 40 : 64]} />
        <meshStandardMaterial
          color="#302a24"
          roughness={0.5}
          bumpMap={resources.texture}
          bumpScale={0.05}
        />
      </mesh>
      <WorkspaceObjects compact={compact} />
      <mesh position={[1.63, 0.54, 1.05]} castShadow>
        <sphereGeometry args={[0.34, compact ? 20 : 32, 20]} />
        <meshStandardMaterial
          ref={lamp}
          color="#ffc886"
          emissive="#ff913c"
          emissiveIntensity={1.25}
          roughness={0.24}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[1.63, 0.205, 1.05]}>
        <cylinderGeometry args={[0.22, 0.25, 0.07, 24]} />
        <meshStandardMaterial color="#735332" metalness={0.7} roughness={0.3} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.6, 0.005, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.7, 0.025]} />
          <meshBasicMaterial color="#f7994b" toneMapped={false} />
        </mesh>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute ref={dust} attach="attributes-position" args={[animated, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffbf7b"
          size={0.016}
          opacity={0.35}
          transparent
          depthWrite={false}
        />
      </points>
    </>
  );
}

export default function ContactScene() {
  const host = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery('(max-width: 1100px)');
  const mobile = useMediaQuery('(max-width: 760px)');
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let inView = false;
    const update = () => setActive(inView && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    const lost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    element.addEventListener('webglcontextlost', lost, true);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      element.removeEventListener('webglcontextlost', lost, true);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return (
    <div
      ref={host}
      className="contact-webgl"
      data-state={failed ? 'fallback' : ready ? 'ready' : 'loading'}
      data-active={active && !failed}
    >
      {!failed && (
        <Canvas
          camera={{ position: [0, 3.05, mobile ? 10.6 : 10], fov: 40, near: 0.1, far: 45 }}
          dpr={[1, compact ? 1 : 1.5]}
          shadows={!compact}
          gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}
          frameloop={active ? 'always' : 'never'}
          onCreated={({ events }) => {
            events.disconnect?.();
            setReady(true);
          }}
          style={{ pointerEvents: 'none' }}
          fallback={null}
        >
          <Studio compact={compact} />
        </Canvas>
      )}
    </div>
  );
}
