"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MONOGRAM_PATHS } from "@/lib/brand";

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Mark({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">${MONOGRAM_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
    const data = new SVGLoader().parse(svg);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 46, bevelEnabled: true, bevelThickness: 5, bevelSize: 3, bevelSegments: 4, curveSegments: 24 });
    geo.center();
    geo.rotateX(Math.PI); // SVG y points down
    geo.scale(0.0044, 0.0044, 0.0044);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const tx = (pointer.current?.y ?? 0) * 0.3 + Math.sin(t * 0.4) * 0.04;
    const ty = (pointer.current?.x ?? 0) * 0.55 + Math.sin(t * 0.25) * 0.22;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 3, dt);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial color="#cfceca" metalness={0.92} roughness={0.32} clearcoat={0.4} clearcoatRoughness={0.4} envMapIntensity={1.1} />
      </mesh>
    </group>
  );
}

export default function MarkScene({ active = true }: { active?: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
      }}
      onPointerLeave={() => (pointer.current = { x: 0, y: 0 })}
    >
      <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 35 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Env />
        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#9aa0a6" />
        <spotLight position={[0, 6, 2]} angle={0.4} penumbra={1} intensity={30} />
        <Mark pointer={pointer} />
      </Canvas>
    </div>
  );
}
