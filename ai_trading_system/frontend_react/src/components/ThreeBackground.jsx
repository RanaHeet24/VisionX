import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// --- Particle Galaxy ---
const ParticleSphere = ({ scrollY }) => {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const m = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 4 + Math.random() * 3;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions.set([x, y, z], i * 3);
        
        m.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.5); 
        colors.set([m.r, m.g, m.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (mesh.current) {
        mesh.current.rotation.y += delta * 0.05;
        // Scroll influences speed
        mesh.current.rotation.x = scrollY.current * 0.0005;
    }
  });

  return (
    <points ref={mesh} geometry={particles}>
      <pointsMaterial 
        size={0.03} 
        vertexColors 
        transparent 
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// --- Floating Data Cubes (About Section Decoration) ---
const DataCubes = ({ count = 20 }) => {
    const cubes = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10 - 15 // Set further back
            ],
            scale: Math.random() * 0.5 + 0.1,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            speed: Math.random() * 0.5 + 0.1
        }));
    }, [count]);

    return (
        <group>
            {cubes.map((c, i) => (
                <Float key={i} speed={c.speed} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={c.position} scale={c.scale} rotation={c.rotation}>
                        <boxGeometry />
                        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.2} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

// --- Interactive Center Core ---
const TradingCore = ({ scrollY }) => {
    const coreRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.2 + scrollY.current * 0.001;
            coreRef.current.position.y = Math.sin(t * 1.5) * 0.2;
            // Distort more when scrolling
            coreRef.current.scale.setScalar(1 + Math.sin(t) * 0.05 + (hovered ? 0.1 : 0));
        }
    });

    return (
        <group>
            <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                <Sphere 
                    ref={coreRef} 
                    args={[1.8, 64, 64]} 
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                >
                    <MeshDistortMaterial
                        color={hovered ? "#00f2ff" : "#06b6d4"}
                        attach="material"
                        distort={0.5}
                        speed={3}
                        roughness={0}
                        metalness={1}
                        emissive="#0891b2"
                        emissiveIntensity={0.5}
                    />
                </Sphere>
            </Float>
            
            {/* Outer Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.01, 16, 100]} />
                <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const MouseController = ({ scrollY }) => {
    const { camera, mouse } = useThree();
    
    useFrame(() => {
        // Scroll influences camera Z (zoom out as we scroll down)
        const targetZ = 8 + scrollY.current * 0.005;
        camera.position.z += (targetZ - camera.position.z) * 0.05;

        // Mouse Parallax
        camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
        camera.position.y += (mouse.y * 3 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
    });

    return null;
};

export const ThreeBackground = () => {
    const scrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            scrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-auto bg-[#030712]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, stencil: false, depth: true }} dpr={[1, 2]}>
                <color attach="background" args={['#030712']} />
                
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#8b5cf6" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />

                <TradingCore scrollY={scrollY} />
                <DataCubes />
                <ParticleSphere scrollY={scrollY} />
                <Stars radius={150} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
                
                <MouseController scrollY={scrollY} />

                <EffectComposer disableNormalPass multisampling={0}>
                    <Bloom 
                        luminanceThreshold={0.2} 
                        mipmapBlur
                        intensity={1.5} 
                        radius={0.4}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <ChromaticAberration offset={[0.0015, 0.0015]} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
