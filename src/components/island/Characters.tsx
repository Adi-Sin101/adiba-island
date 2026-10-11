'use client'

import { Outlines } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { Html } from './Html'
import { DYNAMIC, StaticMerge } from './StaticMerge'
import { PALETTE, patternTexture, toon, toonTextured } from './materials'
import { playPop } from './sound'
import { live, useIsland } from './store'

const OUTLINE = { thickness: 0.035, color: PALETTE.ink } as const

/* ------------------------------------------------------------------ Boop */

const TOUR_SPOT = new THREE.Vector3(2.5, 0.2, 10.5)

const BOOP_LINES = [
  'Boop! I’m Experiment 0101. I guard this island.',
  'Try play mode (press P) and drive me around!',
  'Psst… Penny is napping in the hammock.',
  'Every toy in the workshop is a real project.',
  'Adiba says: seafood first, questions later.',
]

/**
 * Boop — an original blue alien buddy (big ears, antenna, flower lei).
 * In tour mode Boop hangs out at the beach; in play mode visitors steer Boop.
 */
export function Boop() {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const earL = useRef<THREE.Group>(null)
  const earR = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  const legs = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const mode = useIsland((s) => s.mode)
  const sound = useIsland((s) => s.sound)
  const [line, setLine] = useState<string | null>(null)

  useEffect(() => {
    if (!line) return
    const t = setTimeout(() => setLine(null), 3800)
    return () => clearTimeout(t)
  }, [line])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const m = live.mascot
    if (!root.current || !body.current || !head.current) return

    if (mode === 'tour') {
      // idle on the beach, turning gently toward the pointer
      root.current.position.lerp(TOUR_SPOT, 0.08)
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, live.pointer.x * 0.6, 0.05)
      m.speed = 0
    } else {
      root.current.position.set(m.x, 0.2, m.z)
      root.current.rotation.y = m.heading
    }

    const moving = m.speed > 0.1
    const bounce = moving ? Math.abs(Math.sin(t * 12)) * 0.18 : Math.sin(t * 2.2) * 0.05
    body.current.position.y = bounce
    head.current.rotation.x = live.pointer.y * -0.25
    head.current.rotation.z = Math.sin(t * 1.3) * 0.06
    if (earL.current && earR.current) {
      earL.current.rotation.z = 0.5 + Math.sin(t * 3) * 0.08
      earR.current.rotation.z = -0.5 - Math.sin(t * 3 + 1) * 0.08
    }
    if (eyes.current) eyes.current.scale.y = (t % 4.2) < 0.12 ? 0.1 : 1
    if (legs.current) {
      legs.current.children[0].rotation.x = moving ? Math.sin(t * 12) * 0.6 : 0
      legs.current.children[1].rotation.x = moving ? -Math.sin(t * 12) * 0.6 : 0
    }
    if (armR.current) armR.current.rotation.z = moving ? -0.4 : -2.2 + Math.sin(t * 5) * 0.35
    void dt
  })

  function poke(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    setLine(BOOP_LINES[Math.floor(Math.random() * BOOP_LINES.length)])
    if (sound) playPop(660)
  }

  const blue = toon(PALETTE.alienBlue)
  const belly = toon('#a9c8ff')
  return (
    <group ref={root} position={[2.5, 0.2, 10.5]} onClick={poke} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
      <group ref={body}>
        {/* body */}
        <mesh castShadow position-y={0.62} scale={[0.52, 0.5, 0.46]} material={blue}>
          <sphereGeometry args={[1, 24, 18]} />
          <Outlines {...OUTLINE} />
        </mesh>
        <mesh position={[0, 0.6, 0.26]} scale={[0.34, 0.34, 0.24]} material={belly}>
          <sphereGeometry args={[1, 20, 14]} />
        </mesh>
        <StaticMerge>
        {/* flower lei */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.4, 0.98, Math.sin(a) * 0.36]} material={toon(i % 2 ? PALETTE.pink : PALETTE.sun)}>
              <sphereGeometry args={[0.085, 8, 6]} />
            </mesh>
          )
        })}
        {/* arms */}
        <group position={[-0.48, 0.72, 0]} rotation-z={0.5}>
          <mesh castShadow position-y={-0.2} material={blue}>
            <capsuleGeometry args={[0.1, 0.28, 4, 8]} />
          </mesh>
        </group>
        </StaticMerge>
        <group ref={armR} userData={DYNAMIC} position={[0.48, 0.78, 0]} rotation-z={-2.2}>
          <mesh castShadow position-y={-0.2} material={blue}>
            <capsuleGeometry args={[0.1, 0.28, 4, 8]} />
          </mesh>
        </group>
        {/* legs */}
        <group ref={legs} userData={DYNAMIC}>
          {[-0.22, 0.22].map((x) => (
            <group key={x} position={[x, 0.26, 0]}>
              <mesh castShadow position-y={-0.12} material={blue}>
                <capsuleGeometry args={[0.13, 0.16, 4, 8]} />
              </mesh>
            </group>
          ))}
        </group>
        {/* head */}
        <group ref={head} userData={DYNAMIC} position-y={1.42}>
          <mesh castShadow scale={[0.62, 0.52, 0.55]} material={blue}>
            <sphereGeometry args={[1, 28, 20]} />
            <Outlines {...OUTLINE} />
          </mesh>
          <mesh position={[0, -0.12, 0.34]} scale={[0.36, 0.28, 0.24]} material={belly}>
            <sphereGeometry args={[1, 18, 12]} />
          </mesh>
          {/* big round ears */}
          <group ref={earL} position={[-0.5, 0.2, 0]} rotation-z={0.5}>
            <mesh castShadow position-x={-0.32} scale={[0.42, 0.26, 0.06]} material={blue}>
              <sphereGeometry args={[1, 18, 12]} />
              <Outlines {...OUTLINE} />
            </mesh>
            <mesh position={[-0.34, 0, 0.04]} scale={[0.3, 0.17, 0.04]} material={toon(PALETTE.pink)}>
              <sphereGeometry args={[1, 14, 10]} />
            </mesh>
          </group>
          <group ref={earR} position={[0.5, 0.2, 0]} rotation-z={-0.5}>
            <mesh castShadow position-x={0.32} scale={[0.42, 0.26, 0.06]} material={blue}>
              <sphereGeometry args={[1, 18, 12]} />
              <Outlines {...OUTLINE} />
            </mesh>
            <mesh position={[0.34, 0, 0.04]} scale={[0.3, 0.17, 0.04]} material={toon(PALETTE.pink)}>
              <sphereGeometry args={[1, 14, 10]} />
            </mesh>
          </group>
          {/* antenna */}
          <mesh position={[0, 0.62, 0]} rotation-z={0.2} material={toon(PALETTE.alienDark)}>
            <cylinderGeometry args={[0.025, 0.03, 0.34, 6]} />
          </mesh>
          <mesh position={[-0.04, 0.82, 0]} material={toon(PALETTE.pink, { emissive: PALETTE.pink, emissiveIntensity: 0.6 })}>
            <sphereGeometry args={[0.09, 12, 10]} />
          </mesh>
          {/* eyes */}
          <group ref={eyes} position={[0, 0.06, 0.42]}>
            {[-0.2, 0.2].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <mesh scale={[0.15, 0.17, 0.08]} material={toon('#0f0d24')}>
                  <sphereGeometry args={[1, 16, 12]} />
                </mesh>
                <mesh position={[0.04, 0.06, 0.07]} material={toon('#ffffff')}>
                  <sphereGeometry args={[0.04, 8, 6]} />
                </mesh>
              </group>
            ))}
          </group>
          {/* nose + smile */}
          <mesh position={[0, -0.08, 0.53]} scale={[0.1, 0.07, 0.06]} material={toon(PALETTE.alienDark)}>
            <sphereGeometry args={[1, 10, 8]} />
          </mesh>
          <mesh position={[0, -0.22, 0.5]} rotation-z={Math.PI} material={toon('#0f0d24')}>
            <torusGeometry args={[0.08, 0.018, 6, 14, Math.PI]} />
          </mesh>
        </group>
      </group>
      <Html position={[0, 2.6, 0]} center distanceFactor={9} zIndexRange={[30, 0]} pointerEvents="none">
        {line && <div className="speech">{line}</div>}
      </Html>
    </group>
  )
}

/* ----------------------------------------------------------------- Penny */

/** Penny: white with ginger patches, asleep in a striped hammock. Click to wake her. */
export function PennyHammock({ position }: { position: [number, number, number] }) {
  const open = useIsland((s) => s.open)
  const awakeAt = useIsland((s) => s.pennyAwake)
  const sound = useIsland((s) => s.sound)
  const cat = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const sling = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const [awake, setAwake] = useState(false)
  const fabric = useMemo(() => toonTextured(patternTexture('stripes', '#ff7eb6', '#fff1c9', 5)), [])

  useEffect(() => {
    if (!awakeAt) return
    setAwake(true)
    const t = setTimeout(() => setAwake(false), 4500)
    return () => clearTimeout(t)
  }, [awakeAt])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (sling.current) sling.current.rotation.x = Math.sin(t * 0.9) * 0.06
    if (cat.current) {
      const breathe = 1 + Math.sin(t * 1.6) * 0.035
      cat.current.scale.set(1, breathe, breathe)
    }
    if (head.current) {
      const targetX = awake ? -0.55 : 0.15
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, targetX, 0.08)
      head.current.rotation.z = awake ? Math.sin(t * 3) * 0.1 : 0
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * (awake ? 6 : 1.2)) * 0.4
  })

  function wake(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    if (sound) playPop(520)
    open('hammock')
  }

  const white = toon('#fffdf8')
  const ginger = toon(PALETTE.ginger)
  return (
    <group position={position} userData={DYNAMIC}>
      {/* posts */}
      {[-1.7, 1.7].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow position-y={1.1} material={toon(PALETTE.woodDark)}>
            <cylinderGeometry args={[0.1, 0.13, 2.2, 8]} />
          </mesh>
          <mesh position-y={2.25} material={toon(PALETTE.pink)}>
            <sphereGeometry args={[0.14, 10, 8]} />
          </mesh>
        </group>
      ))}
      <group ref={sling} position-y={1.85}>
        {/* ropes */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.45, -0.18, 0]} rotation-z={s * 1.0} material={toon('#d9c3a0')}>
            <cylinderGeometry args={[0.025, 0.025, 0.55, 5]} />
          </mesh>
        ))}
        {/* striped hammock */}
        <mesh castShadow receiveShadow position-y={-0.38} scale={[1.3, 0.48, 0.55]} material={fabric}>
          <sphereGeometry args={[1, 28, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        </mesh>

        {/* Penny */}
        <group
          ref={cat}
          position={[0, -0.36, 0]}
          onClick={wake}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <mesh castShadow scale={[0.62, 0.28, 0.34]} material={white}>
            <sphereGeometry args={[1, 22, 16]} />
            <Outlines {...OUTLINE} />
          </mesh>
          {/* ginger patches like the real Penny */}
          <mesh position={[0.08, 0.13, 0.04]} scale={[0.26, 0.15, 0.24]} material={ginger}>
            <sphereGeometry args={[1, 14, 10]} />
          </mesh>
          <mesh position={[-0.22, 0.12, 0.02]} scale={[0.2, 0.14, 0.22]} material={ginger}>
            <sphereGeometry args={[1, 14, 10]} />
          </mesh>
          {/* paws tucked in front */}
          {[-0.1, 0.1].map((z) => (
            <mesh key={z} position={[0.6, -0.12, z]} scale={[0.14, 0.07, 0.07]} material={white}>
              <sphereGeometry args={[1, 10, 8]} />
            </mesh>
          ))}
          {/* tail */}
          <group ref={tail} userData={DYNAMIC} position={[-0.58, -0.02, 0]}>
            <mesh position={[-0.22, 0, 0.12]} rotation={[0, -0.5, Math.PI / 2]} material={white}>
              <capsuleGeometry args={[0.06, 0.36, 4, 8]} />
            </mesh>
            <mesh position={[-0.38, 0, 0.26]} material={ginger}>
              <sphereGeometry args={[0.075, 8, 6]} />
            </mesh>
          </group>
          {/* head */}
          <group ref={head} userData={DYNAMIC} position={[0.62, 0.08, 0]}>
            <mesh castShadow scale={[0.27, 0.24, 0.27]} material={white}>
              <sphereGeometry args={[1, 20, 16]} />
              <Outlines {...OUTLINE} />
            </mesh>
            {/* ginger cap over the ears */}
            <mesh position={[-0.04, 0.09, 0]} scale={[0.22, 0.13, 0.24]} material={ginger}>
              <sphereGeometry args={[1, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            {[-0.13, 0.13].map((z) => (
              <group key={z} position={[-0.02, 0.2, z]} rotation-x={z > 0 ? 0.3 : -0.3}>
                <mesh material={ginger}>
                  <coneGeometry args={[0.08, 0.16, 4]} />
                </mesh>
                <mesh position={[0.015, -0.005, 0]} scale={0.6} material={toon('#ffc1cf')}>
                  <coneGeometry args={[0.08, 0.16, 4]} />
                </mesh>
              </group>
            ))}
            <mesh position={[0.26, -0.03, 0]} material={toon('#ff9fb5')}>
              <sphereGeometry args={[0.035, 8, 6]} />
            </mesh>
            {[-0.09, 0.09].map((z) =>
              awake ? (
                <mesh key={z} position={[0.22, 0.04, z]} material={toon('#5a8f3a')}>
                  <sphereGeometry args={[0.04, 10, 8]} />
                </mesh>
              ) : (
                <mesh key={z} position={[0.235, 0.04, z]} rotation-x={Math.PI / 2} material={toon(PALETTE.ink)}>
                  <torusGeometry args={[0.035, 0.009, 4, 10, Math.PI]} />
                </mesh>
              ),
            )}
          </group>
        </group>
      </group>
      <Html position={[0.4, 2.7, 0]} center distanceFactor={8} zIndexRange={[30, 0]} pointerEvents="none">
        {awake ? <div className="speech speech--penny">Mrrp?! 🐾</div> : <div className="zzz">z<span>z</span><span>z</span></div>}
      </Html>
    </group>
  )
}
