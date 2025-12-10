import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// --- Materials based on the reference image ---

const greenMaterial = new THREE.MeshStandardMaterial({
  color: "#1a472a", // Deep forest green
  roughness: 0.7,   
  metalness: 0.1,   
  flatShading: true, 
});

const goldMaterial = new THREE.MeshStandardMaterial({
  color: "#FFD700",
  roughness: 0.1,
  metalness: 1.0,
});

const silverMaterial = new THREE.MeshStandardMaterial({
  color: "#E0E0E0",
  roughness: 0.1,
  metalness: 1.0,
});

const creamMaterial = new THREE.MeshStandardMaterial({
  color: "#FFFdd0", 
  roughness: 0.4,
  metalness: 0.1,
});

// Simulates water droplets or crystals
const crystalMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.0,
  metalness: 0.1,
  transparent: true,
  opacity: 0.8,
});

const glowMaterial = new THREE.MeshStandardMaterial({
  color: "#FFF59D",
  emissive: "#FBC02D",
  emissiveIntensity: 3, 
  toneMapped: false,
});

const starMaterial = new THREE.MeshStandardMaterial({
  color: "#FFFF00",
  emissive: "#FFD700",
  emissiveIntensity: 2,
  toneMapped: false,
});

const ribbonMaterial = new THREE.MeshStandardMaterial({
  color: "#FFD700",
  roughness: 0.2,
  metalness: 0.9,
});

// --- Helper Types ---
type ItemData = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

// --- Helper Functions ---
const createStarShape = () => {
    const shape = new THREE.Shape();
    const outerRadius = 0.6;
    const innerRadius = 0.25;
    const points = 5;
    const angleOffset = -Math.PI / 2;

    for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points + angleOffset;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
};

// --- Main Component ---

export const LuxuryTree: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Group>(null);
  const starShape = useMemo(() => createStarShape(), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.03;
    }
    if (starRef.current) {
      starRef.current.rotation.y += 0.005;
      starRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1) * 0.05;
    }
  });

  // --- Procedural Generation ---
  
  const { greenItems, goldItems, creamItems, glowItems, sphereItems, garlandSilver, garlandGold } = useMemo(() => {
    const greenItems: ItemData[] = [];
    const goldItems: ItemData[] = [];
    const creamItems: ItemData[] = [];
    const glowItems: ItemData[] = [];
    const sphereItems: ItemData[] = [];

    // --- 1. Generate Tree Body ---
    const layers = 28; 
    const height = 5.2;
    const baseRadius = 2.0;
    const startY = -2.5;

    for (let i = 0; i < layers; i++) {
        const t = i / layers; 
        const y = startY + t * height;
        const rMax = baseRadius * (1 - t); 
        const circumference = 2 * Math.PI * rMax;
        const itemCount = Math.max(4, Math.floor(circumference * 6)); 

        for (let j = 0; j < itemCount; j++) {
            const angle = (j / itemCount) * Math.PI * 2 + (Math.random() * 0.5); 
            const r = rMax * (0.5 + Math.random() * 0.55); 
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const pos: [number, number, number] = [x, y + (Math.random() * 0.4), z];
            
            const rot: [number, number, number] = [
                Math.random() * Math.PI, 
                Math.random() * Math.PI, 
                Math.random() * Math.PI
            ];

            const sizeBase = 0.35 - (t * 0.15); 
            const scale: [number, number, number] = [
                sizeBase * (0.8 + Math.random() * 0.4),
                sizeBase * (0.8 + Math.random() * 0.4),
                sizeBase * (0.8 + Math.random() * 0.4)
            ];

            const rand = Math.random();
            const itemData = { position: pos, rotation: rot, scale };

            if (rand < 0.12) {
               itemData.scale = [sizeBase*0.8, sizeBase*0.8, sizeBase*0.8]; 
               sphereItems.push(itemData);
            } else if (rand < 0.20) {
               goldItems.push(itemData);
            } else if (rand < 0.35) {
               creamItems.push(itemData);
            } else if (rand < 0.42) {
                glowItems.push(itemData);
            } else {
                itemData.scale = [scale[0]*1.4, scale[1]*1.4, scale[2]*1.4];
                greenItems.push(itemData);
            }
        }
    }

    // --- 2. Generate Garlands (Chains) ---
    // We create two spirals wrapping around the tree
    const garlandSilver: ItemData[] = [];
    const garlandGold: ItemData[] = [];
    
    const garlandPoints = 180; // Number of beads in the chain
    const rotations = 4.5; // How many times it wraps around

    for(let i = 0; i < garlandPoints; i++) {
        const t = i / garlandPoints; // 0 to 1 bottom to top
        
        // Helix math
        const y = startY + (t * height * 0.95); // Stop slightly before very top
        const currentTreeRadius = baseRadius * (1 - t);
        const garlandRadius = currentTreeRadius + 0.15; // Float slightly off the tree

        // Spiral 1: Silver/Crystal
        const angle1 = t * Math.PI * 2 * rotations;
        const x1 = Math.cos(angle1) * garlandRadius;
        const z1 = Math.sin(angle1) * garlandRadius;
        
        // Alternate between small chain links and larger "droplets"
        const isDroplet = i % 5 === 0;
        const s1 = isDroplet ? 0.12 : 0.05;
        
        garlandSilver.push({
            position: [x1, y, z1],
            rotation: [0,0,0],
            scale: [s1, s1, s1]
        });

        // Spiral 2: Gold/Pearl (Offset by PI)
        const angle2 = angle1 + Math.PI;
        const x2 = Math.cos(angle2) * garlandRadius;
        const z2 = Math.sin(angle2) * garlandRadius;
        
        const s2 = isDroplet ? 0.12 : 0.05;

        garlandGold.push({
            position: [x2, y, z2],
            rotation: [0,0,0],
            scale: [s2, s2, s2]
        });
    }

    return { greenItems, goldItems, creamItems, glowItems, sphereItems, garlandSilver, garlandGold };
  }, []);

  // Gift Component
  const Gift: React.FC<{ 
    position: [number, number, number]; 
    color: string; 
    rotationY: number;
    scale: number;
  }> = ({ position, color, rotationY, scale }) => (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.52, 0.52, 0.1]} />
        <primitive object={ribbonMaterial} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.52, 0.52]} />
        <primitive object={ribbonMaterial} />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
        
        {/* === Tree Body === */}
        <Instances range={greenItems.length} material={greenMaterial} castShadow receiveShadow>
            <tetrahedronGeometry args={[0.7, 1]} />
            {greenItems.map((data, i) => (
                <Instance key={`green-${i}`} position={data.position} rotation={data.rotation} scale={data.scale} />
            ))}
        </Instances>

        <Instances range={goldItems.length} material={goldMaterial} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {goldItems.map((data, i) => (
                <Instance key={`gold-${i}`} position={data.position} rotation={data.rotation} scale={data.scale} />
            ))}
        </Instances>

        <Instances range={creamItems.length} material={creamMaterial} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {creamItems.map((data, i) => (
                <Instance key={`cream-${i}`} position={data.position} rotation={data.rotation} scale={data.scale} />
            ))}
        </Instances>

        <Instances range={glowItems.length} material={glowMaterial}>
            <boxGeometry args={[1, 1, 1]} />
            {glowItems.map((data, i) => (
                <Instance key={`glow-${i}`} position={data.position} rotation={data.rotation} scale={data.scale} />
            ))}
        </Instances>

        <Instances range={sphereItems.length} material={goldMaterial} castShadow>
            <sphereGeometry args={[0.5, 16, 16]} /> 
            {sphereItems.map((data, i) => (
                <Instance key={`sphere-${i}`} position={data.position} scale={data.scale} />
            ))}
        </Instances>

        {/* === Garlands / Chains === */}
        
        {/* Silver/Crystal Chain */}
        <Instances range={garlandSilver.length} material={crystalMaterial}>
             <sphereGeometry args={[1, 16, 16]} />
             {garlandSilver.map((data, i) => (
                <Instance key={`silv-${i}`} position={data.position} scale={data.scale} color={i % 5 === 0 ? "#ffffff" : "#cccccc"} />
             ))}
        </Instances>
        {/* Adds sparkles to the crystal chain */}
        <Instances range={garlandSilver.length} material={silverMaterial}>
             <sphereGeometry args={[1, 8, 8]} />
             {garlandSilver.filter((_, i) => i % 5 !== 0).map((data, i) => (
                <Instance key={`silv-b-${i}`} position={data.position} scale={data.scale} />
             ))}
        </Instances>

        {/* Gold Pearl Chain */}
        <Instances range={garlandGold.length} material={goldMaterial}>
             <sphereGeometry args={[1, 16, 16]} />
             {garlandGold.map((data, i) => (
                <Instance key={`gold-g-${i}`} position={data.position} scale={data.scale} />
             ))}
        </Instances>

        {/* === The Star === */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={starRef as any} position={[0, 3.0, 0]}>
                <mesh material={starMaterial} castShadow>
                    <extrudeGeometry 
                        args={[
                            starShape, 
                            { 
                                depth: 0.2, 
                                bevelEnabled: true, 
                                bevelThickness: 0.1, 
                                bevelSize: 0.05,
                                bevelSegments: 2
                            }
                        ]} 
                    />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.8, 16, 16]} />
                    <meshBasicMaterial color="#FFEB3B" transparent opacity={0.15} depthWrite={false} />
                </mesh>
            </group>
        </Float>

        {/* === Base === */}
        <mesh position={[0, -2.8, 0]} receiveShadow>
            <cylinderGeometry args={[0.4, 0.6, 0.6, 8]} />
            <meshStandardMaterial color="#2a1b15" roughness={0.8} />
        </mesh>

        {/* === Luxury Gifts Under Tree === */}
        <group position={[0, -3.1, 0]}>
            <Gift position={[1.4, 0, 0.5]} color="#7f1d1d" rotationY={0.5} scale={1.2} /> 
            <Gift position={[-1.2, 0, 1.2]} color="#064e3b" rotationY={-0.4} scale={1.3} />
            <Gift position={[0.2, 0, 1.6]} color="#fdf5e6" rotationY={0.2} scale={1.0} />
            <Gift position={[-0.8, 0, -1.2]} color="#FFD700" rotationY={2.1} scale={0.9} />
            <Gift position={[0.8, 0, -1.0]} color="#1e3a8a" rotationY={-1.5} scale={1.1} />
        </group>

        {/* Floating Gold Dust */}
        <Sparkles 
            count={150} 
            scale={7} 
            size={4} 
            speed={0.2} 
            opacity={0.6} 
            color="#FFD700" 
            position={[0,0,0]}
        />
    </group>
  );
};