import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Add type definitions for R3F elements to satisfy TypeScript if global types are missing in the environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      torusKnotGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

// A placeholder mesh that spins, representing the "Model"
// In a real scenario, we would use useFBX(url) from @react-three/drei
const PlaceholderMesh = ({ color = '#ea7600' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.8}
      />
    </mesh>
  );
};

interface ModelViewerProps {
  modelUrl: string; // Not used in this demo implementation but kept for API correctness
}

export const ModelViewer: React.FC<ModelViewerProps> = () => {
  return (
    <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden cursor-move">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <Stage environment="city" intensity={0.6}>
           <PlaceholderMesh />
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
      </Canvas>
      <div className="absolute bottom-2 right-2 text-[10px] uppercase font-bold text-zinc-400 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
        Interactive 3D
      </div>
    </div>
  );
};