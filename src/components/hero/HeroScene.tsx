import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Group,
  Mesh,
  Vector3,
  TorusGeometry,
  MeshStandardMaterial,
  OctahedronGeometry,
  SphereGeometry,
  DataTexture,
  RepeatWrapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  BufferAttribute,
} from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '../../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/** Shared, tileable micro-grain; no image download or additional render pass. */
function surfaceDetail() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const noise = Math.sin(i * 127.1 + 31.7) * 43758.5453;
    const value = 202 + Math.floor((noise - Math.floor(noise)) * 32);
    data.set([value, value, value, 255], i * 4);
  }
  const texture = new DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(8, 2);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/** Deterministic points: resizing never reshuffles the composition. */
function particlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.sin(i * 127.1) * 5;
    // Keep the field below the greeting and behind the portrait's opaque center.
    positions[i * 3 + 1] = Math.cos(i * 311.7) * 1.4 - 0.35;
    positions[i * 3 + 2] = -1 - (i % 5) * 0.5;
  }
  return positions;
}

function Orbit({
  radius,
  tilt,
  dark = false,
  geometry,
  material,
}: {
  radius: number;
  tilt: number;
  dark?: boolean;
  geometry: SphereGeometry;
  material: MeshStandardMaterial;
}) {
  const plane = useRef<Group>(null);
  const node = useRef<Mesh>(null);
  const phase = useRef(tilt);
  const age = useRef(0);
  useFrame((_state, delta) => {
    const step = Math.min(delta, 0.05);
    age.current += step;
    phase.current += step * (dark ? -0.065 : 0.095);
    // Bounded precession preserves the composition; no full plane flips through text.
    if (plane.current) {
      plane.current.rotation.x = tilt + Math.sin(age.current * (dark ? 0.06 : 0.085)) * 0.035;
      plane.current.rotation.z =
        (dark ? -0.32 : 0.3) + Math.sin(age.current * (dark ? 0.045 : 0.07)) * 0.025;
    }
    node.current?.position.set(
      Math.cos(phase.current) * radius,
      Math.sin(phase.current) * radius,
      0,
    );
  });
  return (
    <group
      ref={plane}
      position={[0, 0, dark ? -0.4 : 0.15]}
      rotation={[tilt, 0.22, dark ? -0.32 : 0.3]}
    >
      <mesh>
        <torusGeometry args={[radius, 0.008, 5, 120]} />
        <meshBasicMaterial
          color={dark ? '#817b73' : '#f36b21'}
          transparent
          opacity={dark ? 0.22 : 0.48}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={node}
        position={[Math.cos(tilt) * radius, Math.sin(tilt) * radius, 0]}
        scale={dark ? 0.05 : 0.075}
        geometry={geometry}
        material={material}
        dispose={null}
      />
    </group>
  );
}

function Sculpture({ compact, tablet }: { compact: boolean; tablet: boolean }) {
  const sculpture = useRef<Group>(null);
  const scene = useRef<Group>(null);
  const particles = useRef<BufferAttribute>(null);
  const progress = useRef({ value: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const age = useRef(0);
  const target = useMemo(() => new Vector3(0, 0, 0), []);
  const resources = useMemo(() => {
    const detail = surfaceDetail();
    const finish = {
      roughness: 0.66,
      metalness: 0.16,
      bumpMap: detail,
      bumpScale: 0.008,
      roughnessMap: detail,
    };
    return {
      detail,
      ribbon: new TorusGeometry(1.52, 0.27, compact ? 10 : 18, compact ? 64 : 96, Math.PI * 1.65),
      satellite: new OctahedronGeometry(),
      node: new SphereGeometry(1, 12, 8),
      orange: new MeshStandardMaterial({ color: '#f36b21', ...finish }),
      burnt: new MeshStandardMaterial({ color: '#dc541b', ...finish }),
      muted: new MeshStandardMaterial({ color: '#c2936b', roughness: 0.4, metalness: 0.2 }),
    };
  }, [compact]);
  // Shared resources are owned here; Fiber disposes the remaining declarative geometry.
  useEffect(
    () => () => {
      Object.values(resources).forEach((resource) => resource.dispose());
    },
    [resources],
  );
  const positions = useMemo(() => particlePositions(compact ? 12 : 32), [compact]);
  const driftingPositions = useMemo(() => positions.slice(), [positions]);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const fine = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse') return;
      const box = hero.getBoundingClientRect();
      pointer.current.x = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - box.left) / box.width - 0.5),
      );
      pointer.current.y = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - box.top) / box.height - 0.5),
      );
    };
    const leave = () => {
      pointer.current = { x: 0, y: 0 };
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    fine.addEventListener('change', leave);
    window.addEventListener('resize', leave);
    document.addEventListener('visibilitychange', leave);
    // GSAP owns progress; the renderer alone owns camera/mesh transforms.
    const tween = gsap.to(progress.current, {
      value: 1,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      fine.removeEventListener('change', leave);
      window.removeEventListener('resize', leave);
      document.removeEventListener('visibilitychange', leave);
    };
  }, []);

  useFrame(({ camera, gl }, delta) => {
    const step = Math.min(delta, 0.05); // Don't jump after a suspended tab/frame loop.
    age.current += step;
    const ease = 1 - Math.exp(-step * 2.5);
    camera.position.x += (pointer.current.x * 0.24 - camera.position.x) * ease;
    camera.position.y += (-pointer.current.y * 0.14 - camera.position.y) * ease;
    camera.position.z = 9 + progress.current.value * 0.3;
    camera.lookAt(target);
    if (sculpture.current) {
      sculpture.current.rotation.y = age.current * 0.035;
      sculpture.current.rotation.z = -0.25 + Math.sin(age.current * 0.09) * 0.035;
    }
    if (particles.current) {
      for (let i = 0; i < positions.length / 3; i++) {
        const speed = 0.07 + (i % 3) * 0.025;
        particles.current.setXYZ(
          i,
          positions[i * 3] + Math.sin(age.current * speed + i) * 0.035,
          positions[i * 3 + 1] + Math.sin(age.current * speed * 0.8 + i * 2) * 0.06,
          positions[i * 3 + 2],
        );
      }
      particles.current.needsUpdate = true;
    }
    if (scene.current) scene.current.position.y = -0.4 + progress.current.value * 0.35;
    // Useful lifecycle observability without state updates or DOM writes each frame.
    if (!gl.domElement.dataset.rendered) gl.domElement.dataset.rendered = 'true';
  });

  return (
    <>
      <hemisphereLight intensity={0.85} color="#fff5e5" groundColor="#926348" />
      <directionalLight position={[-3, 5, 5]} intensity={3.1} color="#fff7e8" />
      <directionalLight position={[4, -2, 2]} intensity={0.85} color="#ffb16b" />
      <directionalLight position={[-1, 2, -4]} intensity={1.6} color="#ffd1a0" />
      <fog attach="fog" args={['#faf7f0', 12, 22]} />
      <group ref={scene} position={[0, -0.4, 0]} scale={compact ? 0.92 : tablet ? 0.72 : 1}>
        <group
          ref={sculpture}
          position={compact ? [-1.9, 0.7, -0.6] : tablet ? [-0.65, 1.1, -0.6] : [-0.65, 0.25, -0.6]}
          scale={1.08}
          rotation={[0.2, 0, -0.25]}
        >
          {/* Three folded, interlocking ribbons form a dimensional solar sculpture. */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              rotation={[i * 0.75, i * 0.7, i * 1.05]}
              geometry={resources.ribbon}
              material={i === 1 ? resources.burnt : resources.orange}
              dispose={null}
            />
          ))}
        </group>
        <Orbit radius={2.7} tilt={1.1} geometry={resources.node} material={resources.orange} />
        <Orbit
          radius={3.1}
          tilt={0.85}
          dark
          geometry={resources.node}
          material={resources.orange}
        />
        {/* Small faceted satellites establish foreground/background depth. */}
        {[
          [-2.7, 0.15, 0.2],
          [2.5, 0.75, -0.5],
          [1.8, -1.6, 0.4],
        ].map((position, i) => (
          <mesh
            key={i}
            position={position as [number, number, number]}
            rotation={[0.4, 0.3, i]}
            scale={i === 1 ? 0.13 : 0.09}
            geometry={resources.satellite}
            material={i === 1 ? resources.orange : resources.muted}
            dispose={null}
          ></mesh>
        ))}
        <points>
          <bufferGeometry>
            <bufferAttribute
              ref={particles}
              attach="attributes-position"
              args={[driftingPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#b97540"
            size={0.022}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery('(max-width: 760px)');
  const tablet = useMediaQuery('(max-width: 1100px)');
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
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
    document.addEventListener('visibilitychange', update);
    const lost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    // Capture also handles a replaced canvas; no global WebGL or renderer references.
    element.addEventListener('webglcontextlost', lost, true);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      element.removeEventListener('webglcontextlost', lost, true);
    };
  }, []);
  return (
    <div
      ref={host}
      className="hero-webgl"
      data-state={failed ? 'fallback' : ready ? 'ready' : 'loading'}
      data-active={active && !failed}
    >
      {!failed && (
        <Canvas
          camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 30 }}
          dpr={[1, compact ? 1 : 1.5]}
          gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}
          frameloop={active ? 'always' : 'never'}
          onCreated={({ events }) => {
            events.disconnect?.();
            setReady(true);
          }}
          fallback={null}
          style={{ pointerEvents: 'none' }}
        >
          <Sculpture compact={compact} tablet={tablet} />
        </Canvas>
      )}
    </div>
  );
}
