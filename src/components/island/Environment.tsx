'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { PALETTE, toon } from './materials'
import { DYNAMIC, StaticMerge } from './StaticMerge'
import { ISLAND_RADIUS } from './zones'

/* ---------------------------------------------------------------- ocean */

const oceanVertex = /* glsl */ `
  uniform float uTime;
  varying float vDist;
  varying float vWave;
  void main() {
    vec3 p = position;
    float d = length(p.xy);
    float wave = sin(p.x * 0.35 + uTime * 1.2) * 0.12 + cos(p.y * 0.42 + uTime * 0.9) * 0.1;
    wave *= smoothstep(${ISLAND_RADIUS.toFixed(1)}, ${(ISLAND_RADIUS + 6).toFixed(1)}, d);
    p.z += wave;
    vDist = d;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const oceanFragment = /* glsl */ `
  uniform float uTime;
  varying float vDist;
  varying float vWave;
  void main() {
    vec3 shallow = vec3(0.37, 0.89, 0.86);
    vec3 deep = vec3(0.16, 0.48, 0.92);
    vec3 col = mix(shallow, deep, smoothstep(${(ISLAND_RADIUS + 1).toFixed(1)}, ${(ISLAND_RADIUS + 22).toFixed(1)}, vDist));
    // foam rings rolling toward the beach
    float ring = sin(vDist * 2.4 - uTime * 1.6);
    float foam = smoothstep(0.86, 1.0, ring) * (1.0 - smoothstep(${(ISLAND_RADIUS + 0.4).toFixed(1)}, ${(ISLAND_RADIUS + 5).toFixed(1)}, vDist));
    float shore = 1.0 - smoothstep(${(ISLAND_RADIUS - 0.2).toFixed(1)}, ${(ISLAND_RADIUS + 0.9).toFixed(1)}, vDist);
    col = mix(col, vec3(1.0), clamp(foam * 0.8 + shore, 0.0, 1.0));
    col += vWave * 0.35;
    // fade into the sky colour at the horizon
    col = mix(col, vec3(0.75, 0.9, 1.0), smoothstep(45.0, 90.0, vDist));
    gl_FragColor = vec4(col, 1.0);
  }
`

export function Ocean() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: oceanVertex,
        fragmentShader: oceanFragment,
      }),
    [],
  )
  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.35} material={material}>
      <circleGeometry args={[95, 160]} />
    </mesh>
  )
}

/* --------------------------------------------------------------- island */

export function IslandGround() {
  return (
    <StaticMerge>
      {/* sandy beach ring */}
      <mesh receiveShadow position-y={-0.45} material={toon(PALETTE.sand)}>
        <cylinderGeometry args={[ISLAND_RADIUS + 0.6, ISLAND_RADIUS + 1.6, 0.9, 72]} />
      </mesh>
      {/* grass top */}
      <mesh receiveShadow position-y={0.02} material={toon(PALETTE.grass)}>
        <cylinderGeometry args={[ISLAND_RADIUS - 1.6, ISLAND_RADIUS - 0.9, 0.36, 72]} />
      </mesh>
      {/* central hill */}
      <mesh receiveShadow castShadow position={[0.4, -0.6, -2.2]} scale={[3.6, 2.6, 3]} material={toon(PALETTE.grassDark)}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      <mesh castShadow position={[0.6, 1.95, -2.1]} scale={[1.1, 0.5, 1]} material={toon(PALETTE.grass)}>
        <sphereGeometry args={[1, 20, 16]} />
      </mesh>
      {/* stone path from the beach */}
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8
        const x = Math.sin(t * 2.2) * 1.6
        const z = 10.6 - t * 7
        return (
          <mesh key={i} receiveShadow position={[x, 0.21, z]} rotation-y={i} material={toon('#efe3cf')}>
            <cylinderGeometry args={[0.42, 0.46, 0.06, 9]} />
          </mesh>
        )
      })}
    </StaticMerge>
  )
}

/* --------------------------------------------------------------- nature */

export function Palm({ position, scale = 1, lean = 0.15 }: { position: [number, number, number]; scale?: number; lean?: number }) {
  const leaves = useRef<THREE.Group>(null)
  const seed = useMemo(() => Math.random() * 10, [])
  useFrame(({ clock }) => {
    if (leaves.current) leaves.current.rotation.y = Math.sin(clock.elapsedTime * 0.6 + seed) * 0.08
  })
  const segments = 6
  return (
    <group position={position} scale={scale} rotation-z={lean}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh key={i} castShadow position={[Math.sin(i * 0.25) * 0.15, 0.35 + i * 0.55, 0]} material={toon(i % 2 ? PALETTE.palmTrunk : '#a56b39')}>
          <cylinderGeometry args={[0.2 - i * 0.012, 0.24 - i * 0.012, 0.56, 8]} />
        </mesh>
      ))}
      <group ref={leaves} userData={DYNAMIC} position={[0.35, segments * 0.55 + 0.2, 0]}>
        <StaticMerge>
        {Array.from({ length: 7 }).map((_, i) => (
          <group key={i} rotation-y={(i / 7) * Math.PI * 2}>
            <mesh castShadow position={[0.85, -0.12, 0]} rotation-z={-0.45} scale={[1.25, 0.12, 0.42]} material={toon(i % 2 ? PALETTE.palmLeaf : '#34a85b')}>
              <sphereGeometry args={[1, 12, 8]} />
            </mesh>
          </group>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={i} castShadow position={[Math.cos(i * 2.1) * 0.22, -0.28, Math.sin(i * 2.1) * 0.22]} material={toon('#7a4a24')}>
            <sphereGeometry args={[0.16, 10, 8]} />
          </mesh>
        ))}
        </StaticMerge>
      </group>
    </group>
  )
}

export function Bush({ position, color = PALETTE.grassDark, scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {[
        [0, 0.35, 0, 0.5],
        [0.4, 0.28, 0.1, 0.38],
        [-0.38, 0.26, -0.05, 0.36],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} castShadow position={[x, y, z]} material={toon(color)}>
          <sphereGeometry args={[r, 14, 10]} />
        </mesh>
      ))}
    </group>
  )
}

export function Flower({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position-y={0.18} material={toon('#3d9b4a')}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 5]} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.09, 0.38, Math.sin((i / 5) * Math.PI * 2) * 0.09]} material={toon(color)}>
          <sphereGeometry args={[0.07, 8, 6]} />
        </mesh>
      ))}
      <mesh position-y={0.39} material={toon(PALETTE.sun)}>
        <sphereGeometry args={[0.055, 8, 6]} />
      </mesh>
    </group>
  )
}

export function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale} rotation={[0.3, scale * 2, 0.2]} material={toon(PALETTE.rock)}>
      <dodecahedronGeometry args={[0.6, 0]} />
    </mesh>
  )
}

function Cloud({ position, speed, scale }: { position: [number, number, number]; speed: number; scale: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.position.x += dt * speed
    if (ref.current.position.x > 55) ref.current.position.x = -55
  })
  return (
    <group ref={ref} userData={DYNAMIC} position={position} scale={scale}>
      <StaticMerge>
      {[
        [0, 0, 0, 1.3],
        [1.3, -0.2, 0.2, 1],
        [-1.3, -0.25, 0, 0.95],
        [0.5, 0.6, 0, 0.9],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} material={toon('#ffffff')}>
          <sphereGeometry args={[r, 16, 12]} />
        </mesh>
      ))}
      </StaticMerge>
    </group>
  )
}

export function Clouds() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        position: [-50 + i * 12 + Math.random() * 6, 11 + Math.random() * 7, -30 + Math.random() * 40] as [number, number, number],
        speed: 0.4 + Math.random() * 0.5,
        scale: 0.9 + Math.random() * 0.9,
      })),
    [],
  )
  return (
    <>
      {clouds.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
    </>
  )
}

/** A giant rubber duck bobbing in the lagoon, because toys. */
export function RubberDuck({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 1.4) * 0.12
    ref.current.rotation.z = Math.sin(t * 1.1) * 0.08
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.6 + 2
  })
  return (
    <group ref={ref} userData={DYNAMIC} position={position} scale={1.3}>
      <mesh castShadow scale={[1.2, 0.8, 1]} material={toon(PALETTE.sun)}>
        <sphereGeometry args={[0.7, 20, 16]} />
      </mesh>
      <mesh castShadow position={[0.55, 0.75, 0]} material={toon(PALETTE.sun)}>
        <sphereGeometry args={[0.45, 20, 16]} />
      </mesh>
      <mesh position={[1.0, 0.68, 0]} scale={[1, 0.4, 1]} material={toon('#ff8a1f')}>
        <sphereGeometry args={[0.22, 12, 10]} />
      </mesh>
      {[-0.2, 0.2].map((z) => (
        <mesh key={z} position={[0.86, 0.9, z]} material={toon(PALETTE.ink)}>
          <sphereGeometry args={[0.06, 8, 6]} />
        </mesh>
      ))}
      <mesh position={[-0.8, 0.3, 0]} rotation-z={0.7} material={toon(PALETTE.sun)}>
        <coneGeometry args={[0.22, 0.5, 10]} />
      </mesh>
    </group>
  )
}

export function Gulls() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.15
    ref.current.children.forEach((g, i) => {
      g.rotation.z = Math.sin(clock.elapsedTime * 6 + i) * 0.35
    })
  })
  return (
    <group ref={ref} userData={DYNAMIC} position={[0, 9, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[Math.cos(i * 2.1) * (16 + i * 2), i * 0.8, Math.sin(i * 2.1) * (16 + i * 2)]} rotation-y={i * 2.1}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, 0, s * 0.3]} rotation-x={s * 0.4} material={toon('#ffffff')}>
              <boxGeometry args={[0.18, 0.04, 0.6]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export const PALMS: { position: [number, number, number]; lean: number; scale?: number }[] = [
  { position: [2.6, 0.2, 6.2], lean: 0.12 },
  { position: [6.8, 0.2, 7.6], lean: -0.18, scale: 1.05 },
  { position: [-10.5, 0.1, 1.8], lean: 0.2, scale: 1.1 },
  { position: [-6.5, 0.2, -10], lean: -0.15 },
  { position: [9.8, 0.1, -6.5], lean: 0.22, scale: 0.95 },
  { position: [11.4, -0.1, 0.4], lean: -0.25, scale: 0.9 },
  { position: [-1.8, 0.2, 11], lean: 0.3, scale: 0.85 },
  { position: [1.4, 1.4, -4.6], lean: 0.05, scale: 0.8 },
]

export const BUSHES: { position: [number, number, number]; color?: string; scale?: number }[] = [
  { position: [-1.6, 0.2, 5.5] },
  { position: [8.4, 0.2, -5], color: '#4ea85a', scale: 1.2 },
  { position: [-8.6, 0.2, -1.6], scale: 0.9 },
  { position: [0.8, 0.2, -9.6], scale: 1.1 },
  { position: [-6, 0.2, 6.6], color: '#66c25c' },
]

export const ROCKS: { position: [number, number, number]; scale: number }[] = [
  { position: [-12.4, 0, -6.4], scale: 1.6 },
  { position: [-11, -0.1, -2.6], scale: 1.1 },
  { position: [12.6, -0.2, -3.6], scale: 1.2 },
  { position: [-2.8, -0.2, 13.2], scale: 0.8 },
]

export function Scenery() {
  const flowerColors = [PALETTE.pink, '#ff5d8f', PALETTE.lilac, '#ffffff', PALETTE.coral]
  const flowers = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => {
        const a = i * 2.39996
        const r = 4 + ((i * 37) % 70) / 10
        return { position: [Math.cos(a) * r, 0.2, Math.sin(a) * r] as [number, number, number], color: flowerColors[i % flowerColors.length] }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return (
    <group>
      <StaticMerge>
        {PALMS.map((p, i) => (
          <Palm key={i} {...p} />
        ))}
        {BUSHES.map((b, i) => (
          <Bush key={i} {...b} />
        ))}
        {ROCKS.map((r, i) => (
          <Rock key={i} {...r} />
        ))}
        {flowers.map((f, i) => (
          <Flower key={i} {...f} />
        ))}
      </StaticMerge>
      <RubberDuck position={[-16, -0.1, 9]} />
      <Gulls />
    </group>
  )
}
