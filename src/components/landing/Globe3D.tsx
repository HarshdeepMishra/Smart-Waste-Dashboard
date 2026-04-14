import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, Sphere, Stars, Float, PerspectiveCamera
} from '@react-three/drei';

import { EffectComposer, Bloom, Scanline, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

const CITY_COORDS = [
  { name: 'Mumbai', lat: 19.076, lon: 72.877 },
  { name: 'Delhi', lat: 28.704, lon: 77.102 },
  { name: 'Bangalore', lat: 12.971, lon: 77.594 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.486 },
  { name: 'Chennai', lat: 13.082, lon: 80.270 },
];

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const DataArc = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(1.5);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(50);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#10b981" transparent opacity={0.2} />
      </line>
      <Float speed={5} rotationIntensity={0} floatIntensity={0.2}>
        <mesh position={start}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </Float>
    </group>
  );
};

const Earth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.0012;
  });

  const arcs = useMemo(() => {
    const list = [];
    for (let i = 0; i < CITY_COORDS.length; i++) {
       const start = latLonToVector3(CITY_COORDS[i].lat, CITY_COORDS[i].lon, 1);
       const end = latLonToVector3(CITY_COORDS[(i + 1) % CITY_COORDS.length].lat, CITY_COORDS[(i + 1) % CITY_COORDS.length].lon, 1);
       list.push({ start, end });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Glow Aura */}
      <Sphere args={[1.05, 64, 64]}>
        <meshStandardMaterial 
          color="#0B3D2E" 
          transparent opacity={0.1} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Main Surface */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial 
          color="#020617" 
          roughness={0.7} 
          metalness={0.4}
          emissive="#064e3b"
          emissiveIntensity={0.2}
          wireframe
        />
      </Sphere>

      {/* Indian Partners Pulse Points */}
      {CITY_COORDS.map((city) => (
        <mesh key={city.name} position={latLonToVector3(city.lat, city.lon, 1.01)}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
          <pointLight color="#10b981" intensity={1} distance={0.5} />
        </mesh>
      ))}

      {/* Connectivity Arcs */}
      {arcs.map((arc, i) => (
        <DataArc key={i} start={arc.start} end={arc.end} />
      ))}

      {/* Atmospheric Cloud layer */}
      <Sphere ref={cloudRef} args={[1.03, 64, 64]}>
        <meshStandardMaterial 
          transparent 
          opacity={0.05} 
          color="#A5D6A7" 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
};

const Globe3D: React.FC = () => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure Three.js context is stable
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#020617]">
      <Canvas dpr={[1, 2]} onCreated={() => setReady(true)}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <Earth />
        </Float>
        
        {ready && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2} 
              intensity={1.2} 
              radius={0.4} 
            />
            <Scanline opacity={0.03} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
          </EffectComposer>
        )}

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.3} 
        />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-80" />
    </div>
  );
};

export default Globe3D;
