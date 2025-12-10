import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { LuxuryTree } from './LuxuryTree';

export const Scene: React.FC = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      
      {/* Lighting - Dramatic & Warm */}
      <ambientLight intensity={0.2} color="#004225" />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#fff0d4"
      />
      <pointLight position={[-10, -5, -10]} intensity={1} color="#FFD700" />
      <pointLight position={[0, 5, 5]} intensity={1.5} color="#ffffff" />

      {/* The Subject */}
      <LuxuryTree />

      {/* Ground Shadows */}
      <ContactShadows 
        resolution={1024} 
        scale={20} 
        blur={2} 
        opacity={0.5} 
        far={10} 
        color="#000000" 
      />

      {/* Environment Reflections */}
      <Environment preset="city" background={false} />

      {/* Post Processing for Cinematic Feel */}
      <EffectComposer disableNormalPass>
        {/* Intense Bloom for the "Glow" */}
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>

      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5} 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2}
        minDistance={4}
        maxDistance={12}
      />
    </Canvas>
  );
};