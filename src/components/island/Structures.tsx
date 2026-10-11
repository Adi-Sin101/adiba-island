'use client'

import { RoundedBox } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'

import type { Place, Project } from '@/lib/types'
import { AdibaFigure, OUTFITS } from './Adiba'
import { PennyHammock } from './Characters'
import { BEACH_FIGURES } from './colliders'
import { Html } from './Html'
import { PALETTE, patternTexture, toon, toonTextured } from './materials'
import { playPop } from './sound'
import { DYNAMIC, StaticMerge } from './StaticMerge'
import { useIsland } from './store'
import { TOY_COMPONENTS } from './Toys'
import { zoneById, type ZoneId } from './zones'

/* ------------------------------------------------------- shared hotspot */

/** Wraps a zone's model: hover bounce, click to open, floating sign. */
function Hotspot({ id, children, labelY = 3.2 }: { id: ZoneId; children: ReactNode; labelY?: number }) {
  const zone = zoneById(id)
  const rotation = zone.facing
  const ref = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)
  const open = useIsland((s) => s.open)
  const focus = useIsland((s) => s.focus)
  const mode = useIsland((s) => s.mode)
  const nearby = useIsland((s) => s.nearby)
  const sound = useIsland((s) => s.ambience)
  const panelOpen = useIsland((s) => s.panelOpen)
  const active = focus === id || nearby === id
  const showTag = mode === 'tour' && !panelOpen

  useFrame(({ clock }) => {
    if (!ref.current) return
    const target = hover ? 1.06 : 1
    const s = THREE.MathUtils.lerp(ref.current.scale.x, target, 0.15)
    ref.current.scale.setScalar(s)
    if (ring.current) {
      const m = ring.current.material as THREE.MeshBasicMaterial
      m.opacity = THREE.MathUtils.lerp(m.opacity, hover || active ? 0.55 : 0, 0.1)
      ring.current.rotation.z = clock.elapsedTime * 0.4
    }
  })

  function click(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    if (sound) playPop()
    open(id)
  }

  return (
    <group position={[zone.at[0], 0.2, zone.at[1]]}>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.03}>
        <ringGeometry args={[2.1, 2.45, 48, 1, 0, Math.PI * 1.7]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <group
        ref={ref}
        rotation-y={rotation}
        onClick={click}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = ''
        }}
      >
        <StaticMerge>{children}</StaticMerge>
      </group>
      <Html position={[0, labelY, 0]} center distanceFactor={14} zIndexRange={[20, 0]} style={{ display: showTag ? undefined : 'none' }}>
          <button
            type="button"
            className={`zone-tag ${hover || active ? 'zone-tag--on' : ''}`}
            style={{ ['--tag' as string]: zone.color }}
            onClick={() => open(id)}
          >
            <span aria-hidden>{zone.emoji}</span> {zone.label}
          </button>
      </Html>
    </group>
  )
}

/* -------------------------------------------------------------- welcome */

function TikiTorch({ position }: { position: [number, number, number] }) {
  const flame = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (flame.current) flame.current.scale.y = 1 + Math.sin(clock.elapsedTime * 9 + position[0]) * 0.15
  })
  return (
    <group position={position}>
      <mesh castShadow position-y={0.7} material={toon(PALETTE.woodDark)}>
        <cylinderGeometry args={[0.05, 0.07, 1.4, 6]} />
      </mesh>
      <mesh position-y={1.45} material={toon('#7a4a24')}>
        <cylinderGeometry args={[0.12, 0.08, 0.22, 8]} />
      </mesh>
      <mesh ref={flame} userData={DYNAMIC} position-y={1.68} material={toon('#ffb21f', { emissive: '#ff7a00', emissiveIntensity: 0.9 })}>
        <coneGeometry args={[0.1, 0.32, 8]} />
      </mesh>
    </group>
  )
}

function Welcome({ name, nickname }: { name: string; nickname: string }) {
  return (
    <Hotspot id="welcome" labelY={3.6}>
      <AdibaFigure outfit={OUTFITS.gingham} position={[-0.9, 0, 0.2]} rotation={-0.25} />
      {/* sign board */}
      <group position={[1, 0, -0.3]} rotation-y={-0.2}>
        {[-0.75, 0.75].map((x) => (
          <mesh key={x} castShadow position={[x, 0.9, 0]} material={toon(PALETTE.woodDark)}>
            <cylinderGeometry args={[0.07, 0.08, 1.8, 6]} />
          </mesh>
        ))}
        <RoundedBox args={[2.1, 1, 0.14]} radius={0.08} position-y={1.6} castShadow material={toon(PALETTE.wood)} />
        <Html transform position={[0, 1.6, 0.08]} distanceFactor={2.2} zIndexRange={[10, 0]} pointerEvents="none">
          <div className="board">
            <small>welcome to</small>
            <strong>{name.split(' ')[0]}&apos;s Island</strong>
            <em>{nickname} · est. 2026</em>
          </div>
        </Html>
      </group>
      <TikiTorch position={[-2, 0, -0.6]} />
      <TikiTorch position={[2.4, 0, 0.4]} />
    </Hotspot>
  )
}

/* ------------------------------------------------------------- workshop */

function Workshop({ projects }: { projects: Project[] }) {
  const open = useIsland((s) => s.open)
  const shelf = useMemo(() => {
    const featured = projects.filter((p) => p.featured)
    return (featured.length ? featured : projects).slice(0, 8)
  }, [projects])
  const colors = [PALETTE.coral, PALETTE.blue, PALETTE.teal, PALETTE.lilac, PALETTE.pink, '#ff9b3d', '#5ac26e', PALETTE.sun]
  const awning = useMemo(() => toonTextured(patternTexture('stripes', '#ffb547', '#fffaf2', 3)), [])

  return (
    <Hotspot id="workshop" labelY={4}>
      {/* back wall + floor */}
      <RoundedBox args={[3.6, 0.2, 2]} radius={0.06} position-y={0.1} receiveShadow material={toon('#f6dcb4')} />
      <RoundedBox args={[3.6, 2.6, 0.2]} radius={0.06} position={[0, 1.4, -0.9]} castShadow material={toon('#ffd9a0')} />
      {[-1.7, 1.7].map((x) => (
        <RoundedBox key={x} args={[0.2, 2.6, 2]} radius={0.06} position={[x, 1.4, 0]} castShadow material={toon('#ffcd85')} />
      ))}
      {/* striped awning roof */}
      <mesh castShadow position={[0, 2.9, 0.1]} rotation-x={0.25} material={awning}>
        <boxGeometry args={[4, 0.12, 2.6]} />
      </mesh>
      {/* sign */}
      <Html transform position={[0, 2.35, 1.03]} distanceFactor={2} zIndexRange={[10, 0]} pointerEvents="none">
        <div className="shop-sign">TOY WORKSHOP</div>
      </Html>
      {/* shelves with project toys */}
      {[0.75, 1.65].map((y, row) => (
        <group key={y}>
          <mesh castShadow position={[0, y, -0.55]} material={toon(PALETTE.wood)}>
            <boxGeometry args={[3.2, 0.08, 0.6]} />
          </mesh>
          {shelf.slice(row * 4, row * 4 + 4).map((p, i) => {
            const Toy = TOY_COMPONENTS[p.toy] ?? TOY_COMPONENTS.blocks
            return (
              <group
                key={p.id}
                position={[-1.15 + i * 0.77, y + 0.05, -0.5]}
                onClick={(e) => {
                  e.stopPropagation()
                  open('workshop', { project: p.slug })
                }}
              >
                <ToyBob seed={i + row * 4}>
                  <Toy color={colors[(i + row * 4) % colors.length]} />
                </ToyBob>
              </group>
            )
          })}
        </group>
      ))}
      {/* workbench */}
      <RoundedBox args={[1.4, 0.5, 0.6]} radius={0.05} position={[0.6, 0.45, 0.6]} castShadow material={toon(PALETTE.woodDark)} />
      <mesh position={[0.3, 0.78, 0.6]} rotation-z={0.6} material={toon('#8a8fa3')}>
        <boxGeometry args={[0.5, 0.06, 0.08]} />
      </mesh>
    </Hotspot>
  )
}

function ToyBob({ children, seed }: { children: ReactNode; seed: number }) {
  const ref = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime + seed
    ref.current.position.y = hover ? 0.12 + Math.sin(t * 8) * 0.03 : 0
    ref.current.rotation.y = hover ? t * 3 : Math.sin(t * 0.8) * 0.3
  })
  return (
    <group ref={ref} userData={DYNAMIC} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      {children}
    </group>
  )
}

/* --------------------------------------------------------- block tower */

function BlockTower() {
  const colors = [PALETTE.coral, PALETTE.blue, PALETTE.sun, '#5ac26e', PALETTE.lilac, PALETTE.pink]
  const letters = ['A', 'D', 'I', 'B', 'A']
  return (
    <Hotspot id="blocks" labelY={4.6}>
      {letters.map((l, i) => (
        <group key={i} position={[(i - 2) * 0.62, 0.3, 0.6]} rotation-y={(i - 2) * 0.08}>
          <RoundedBox args={[0.58, 0.58, 0.58]} radius={0.06} castShadow material={toon(colors[i])} />
          <Html transform position={[0, 0, 0.3]} distanceFactor={1.4} zIndexRange={[10, 0]} pointerEvents="none">
            <div className="block-letter">{l}</div>
          </Html>
        </group>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <RoundedBox
          key={i}
          args={[0.7 - i * 0.04, 0.5, 0.7 - i * 0.04]}
          radius={0.06}
          position={[Math.sin(i * 1.7) * 0.08, 0.25 + i * 0.5, -0.4]}
          rotation-y={i * 0.35}
          castShadow
          material={toon(colors[(i + 2) % colors.length])}
        />
      ))}
    </Hotspot>
  )
}

/* ------------------------------------------------------------ lighthouse */

function Lighthouse() {
  const beam = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (beam.current) beam.current.rotation.y += dt * 0.8
  })
  return (
    <Hotspot id="lighthouse" labelY={6.4}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} castShadow position-y={0.45 + i * 0.85} material={toon(i % 2 ? PALETTE.white : PALETTE.coral)}>
          <cylinderGeometry args={[0.95 - (i + 1) * 0.1, 1 - i * 0.1, 0.86, 24]} />
        </mesh>
      ))}
      <mesh position-y={4.55} material={toon('#3a3f5c')}>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 20]} />
      </mesh>
      <mesh position-y={4.95} material={toon('#fff6b0', { emissive: '#ffe066', emissiveIntensity: 0.8 })}>
        <cylinderGeometry args={[0.4, 0.4, 0.7, 16]} />
      </mesh>
      <mesh position-y={5.55} castShadow material={toon(PALETTE.coral)}>
        <coneGeometry args={[0.6, 0.6, 16]} />
      </mesh>
      <group ref={beam} userData={DYNAMIC} position-y={4.95}>
        <mesh position-x={3} rotation-z={Math.PI / 2}>
          <coneGeometry args={[0.7, 6, 16, 1, true]} />
          <meshBasicMaterial color="#fff3a6" transparent opacity={0.22} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* tiny door + window */}
      <mesh position={[0, 0.45, 0.93]} material={toon(PALETTE.woodDark)}>
        <boxGeometry args={[0.38, 0.6, 0.06]} />
      </mesh>
      <mesh position={[0, 2.2, 0.72]} material={toon('#7cc6ff')}>
        <circleGeometry args={[0.16, 16]} />
      </mesh>
      <AdibaFigure outfit={OUTFITS.emerald} position={[1.25, 0, 1.45]} rotation={-0.35} scale={0.85} />
      {/* stack of papers at the base */}
      <group position={[1.3, 0, 0.6]}>
        {[0, 1, 2].map((i) => (
          <RoundedBox key={i} args={[0.5, 0.08, 0.38]} radius={0.02} position-y={0.05 + i * 0.09} rotation-y={i * 0.25} castShadow material={toon(i === 2 ? '#ffffff' : '#e9f1ff')} />
        ))}
      </group>
    </Hotspot>
  )
}

/* ---------------------------------------------------------------- stage */

function Stage() {
  const lights = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    lights.current?.children.forEach((c, i) => {
      c.rotation.z = Math.sin(clock.elapsedTime * 1.4 + i * 2) * 0.35
    })
  })
  const bunting = [PALETTE.pink, PALETTE.sun, PALETTE.teal, PALETTE.coral, PALETTE.lilac, PALETTE.blue, PALETTE.pink]
  return (
    <Hotspot id="stage" labelY={4.4}>
      <RoundedBox args={[3.6, 0.5, 2.2]} radius={0.08} position-y={0.25} castShadow receiveShadow material={toon('#6b4bd1')} />
      <mesh position={[0, 0.51, 0]} receiveShadow material={toon(PALETTE.wood)}>
        <boxGeometry args={[3.4, 0.03, 2]} />
      </mesh>
      {/* curtains */}
      {[-1, 1].map((s) => (
        <mesh key={s} castShadow position={[s * 1.55, 1.85, -0.85]} scale={[0.45, 1.4, 0.2]} material={toon('#d6336c')}>
          <cylinderGeometry args={[1, 0.6, 2, 12]} />
        </mesh>
      ))}
      <RoundedBox args={[3.8, 0.4, 0.3]} radius={0.06} position={[0, 3.25, -0.85]} castShadow material={toon('#a8235a')} />
      <mesh position={[0, 1.85, -0.98]} material={toon('#2b2150')}>
        <boxGeometry args={[2.8, 2.6, 0.05]} />
      </mesh>
      <Html transform position={[0, 2.1, -0.94]} distanceFactor={2.2} zIndexRange={[10, 0]} pointerEvents="none">
        <div className="stage-sign">✦ on stage ✦</div>
      </Html>
      {/* bunting */}
      {bunting.map((c, i) => (
        <mesh key={i} position={[-1.5 + i * 0.5, 2.95, -0.6]} rotation-x={Math.PI} material={toon(c)}>
          <coneGeometry args={[0.13, 0.3, 3]} />
        </mesh>
      ))}
      <AdibaFigure outfit={OUTFITS.festive} position={[-0.8, 0.52, 0.25]} rotation={0.25} scale={0.85} />
      {/* mic */}
      <group position={[0, 0.52, 0.2]}>
        <mesh position-y={0.55} material={toon('#333')}>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
        </mesh>
        <mesh position-y={1.15} material={toon('#999')}>
          <sphereGeometry args={[0.08, 10, 8]} />
        </mesh>
        <mesh position-y={0.02} material={toon('#333')}>
          <cylinderGeometry args={[0.18, 0.2, 0.04, 12]} />
        </mesh>
      </group>
      {/* spotlights */}
      <group ref={lights} userData={DYNAMIC}>
        {[-1.4, 1.4].map((x) => (
          <group key={x} position={[x, 0.6, 1.2]}>
            <mesh position-y={0.2} rotation-x={-0.6} material={toon('#2d2d3a')}>
              <cylinderGeometry args={[0.12, 0.18, 0.3, 10]} />
            </mesh>
          </group>
        ))}
      </group>
      {/* trophy */}
      <group position={[1.1, 0.52, 0.5]}>
        <mesh castShadow position-y={0.12} material={toon('#7a4a24')}>
          <boxGeometry args={[0.22, 0.24, 0.22]} />
        </mesh>
        <mesh castShadow position-y={0.38} material={toon('#ffcc33', { emissive: '#ffb300', emissiveIntensity: 0.25 })}>
          <cylinderGeometry args={[0.16, 0.06, 0.28, 14]} />
        </mesh>
      </group>
    </Hotspot>
  )
}

/* ------------------------------------------------------------- boutique */

function Boutique() {
  const tent = useMemo(() => toonTextured(patternTexture('stripes', '#ff8fd0', '#fff4fb', 6)), [])
  const sparkle = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (sparkle.current) sparkle.current.rotation.y = clock.elapsedTime * 0.7
  })
  return (
    <Hotspot id="boutique" labelY={4.6}>
      <mesh castShadow position-y={1} material={toon('#fff0f7')}>
        <cylinderGeometry args={[1.5, 1.5, 2, 24, 1, true, Math.PI * 0.3, Math.PI * 1.4]} />
      </mesh>
      <mesh castShadow position-y={2.55} material={tent}>
        <coneGeometry args={[1.85, 1.2, 24]} />
      </mesh>
      <mesh position-y={3.25} material={toon(PALETTE.sun)}>
        <sphereGeometry args={[0.15, 12, 10]} />
      </mesh>
      <mesh receiveShadow position-y={0.04} material={toon('#ffd6ea')}>
        <cylinderGeometry args={[1.55, 1.55, 0.08, 24]} />
      </mesh>
      {/* mannequin in a dress */}
      <group position={[0, 0.08, 0.2]}>
        <mesh castShadow position-y={0.65} material={toon('#d6336c')}>
          <coneGeometry args={[0.45, 1, 18]} />
        </mesh>
        <mesh castShadow position-y={1.3} scale={[0.22, 0.28, 0.18]} material={toon('#f4e1d2')}>
          <sphereGeometry args={[1, 14, 10]} />
        </mesh>
        <mesh position-y={1.66} material={toon('#f4e1d2')}>
          <sphereGeometry args={[0.13, 12, 10]} />
        </mesh>
      </group>
      <AdibaFigure outfit={OUTFITS.littleBlack} position={[0.95, 0.08, 0.95]} rotation={0.2} scale={0.85} />
      {/* clothes rack */}
      <group position={[-0.9, 0.08, -0.3]}>
        <mesh position-y={1.3} rotation-z={Math.PI / 2} material={toon('#c0c4d6')}>
          <cylinderGeometry args={[0.025, 0.025, 1, 6]} />
        </mesh>
        {[-0.4, 0.4].map((x) => (
          <mesh key={x} position={[x, 0.65, 0]} material={toon('#c0c4d6')}>
            <cylinderGeometry args={[0.025, 0.025, 1.3, 6]} />
          </mesh>
        ))}
        {[PALETTE.teal, PALETTE.sun, PALETTE.lilac].map((c, i) => (
          <mesh key={c} castShadow position={[-0.3 + i * 0.3, 0.95, 0]} material={toon(c)}>
            <coneGeometry args={[0.15, 0.55, 10]} />
          </mesh>
        ))}
      </group>
      {/* mirror */}
      <group position={[0.95, 0.08, -0.35]} rotation-y={-0.5}>
        <RoundedBox args={[0.6, 1.3, 0.08]} radius={0.1} position-y={0.75} castShadow material={toon(PALETTE.sun)} />
        <mesh position={[0, 0.75, 0.05]} material={toon('#dff4ff', { emissive: '#bfe8ff', emissiveIntensity: 0.3 })}>
          <planeGeometry args={[0.46, 1.12]} />
        </mesh>
      </group>
      <group ref={sparkle} userData={DYNAMIC} position-y={2}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos(i * 1.57) * 2.1, Math.sin(i) * 0.3, Math.sin(i * 1.57) * 2.1]} material={toon('#fff', { emissive: '#ffd1ec', emissiveIntensity: 1 })}>
            <octahedronGeometry args={[0.1]} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  )
}

/* ---------------------------------------------------------------- shack */

function Shrimp({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 1.1
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * 0.45, Math.sin(a) * 0.45, 0]} material={toon(i % 2 ? '#ff8f6b' : '#ff7a59')}>
            <sphereGeometry args={[0.2 - i * 0.022, 12, 10]} />
          </mesh>
        )
      })}
      <mesh position={[0.5, -0.05, 0.12]} material={toon(PALETTE.ink)}>
        <sphereGeometry args={[0.04, 8, 6]} />
      </mesh>
      <mesh position={[0.62, 0.05, 0]} rotation-z={-0.6} material={toon('#ff7a59')}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
      </mesh>
    </group>
  )
}

function Crab({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.x = position[0] + Math.sin(clock.elapsedTime * 0.8) * 0.5
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 8) * 0.06
  })
  return (
    <group ref={ref} userData={DYNAMIC} position={position}>
      <mesh castShadow position-y={0.14} scale={[1, 0.6, 0.8]} material={toon('#ff4d4d')}>
        <sphereGeometry args={[0.2, 14, 10]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.26, 0.2, 0.08]} material={toon('#ff4d4d')}>
          <sphereGeometry args={[0.08, 10, 8]} />
        </mesh>
      ))}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.12]} material={toon(PALETTE.ink)}>
          <sphereGeometry args={[0.03, 6, 6]} />
        </mesh>
      ))}
    </group>
  )
}

function Shack() {
  return (
    <Hotspot id="shack" labelY={4.4}>
      {[-1, 1].flatMap((x) =>
        [-0.7, 0.7].map((z) => (
          <mesh key={`${x}${z}`} castShadow position={[x * 1.2, 1.1, z]} material={toon(PALETTE.woodDark)}>
            <cylinderGeometry args={[0.08, 0.09, 2.2, 6]} />
          </mesh>
        )),
      )}
      {/* thatched roof */}
      <mesh castShadow position-y={2.65} rotation-y={Math.PI / 4} scale={[1.25, 1, 0.85]} material={toon('#e8b35a')}>
        <coneGeometry args={[2.1, 1.3, 4]} />
      </mesh>
      {/* counter */}
      <RoundedBox args={[2.5, 0.9, 0.5]} radius={0.06} position={[0, 0.45, 0.8]} castShadow material={toon('#4fb3d9')} />
      <mesh position={[0, 0.92, 0.8]} material={toon(PALETTE.wood)}>
        <boxGeometry args={[2.6, 0.06, 0.6]} />
      </mesh>
      <Html transform position={[0, 0.5, 1.07]} distanceFactor={2} zIndexRange={[10, 0]} pointerEvents="none">
        <div className="shop-sign shop-sign--sea">SEAFOOD SHACK</div>
      </Html>
      {/* plates of food */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <group key={x} position={[x, 0.97, 0.8]}>
          <mesh material={toon('#ffffff')}>
            <cylinderGeometry args={[0.2, 0.16, 0.04, 16]} />
          </mesh>
          <mesh position-y={0.07} scale={[1, 0.5, 1]} material={toon(['#ff8f6b', '#ffd27a', '#f26b5b'][i])}>
            <sphereGeometry args={[0.12, 10, 8]} />
          </mesh>
        </group>
      ))}
      <Shrimp position={[0, 3.45, 0]} scale={0.9} />
      <Crab position={[1.6, 0, 1.4]} />
      <AdibaFigure outfit={OUTFITS.denim} position={[-0.9, 0, 1.45]} rotation={0.3} scale={0.85} />
    </Hotspot>
  )
}

/* ----------------------------------------------------------------- dock */

function latLngToVec(lat: number, lng: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

function Globe({ places }: { places: Place[] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25
  })
  const pins = places.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
  return (
    <group position-y={1.75}>
      <group ref={ref} userData={DYNAMIC} rotation-x={0.35}>
        <mesh castShadow material={toon('#54b8ff')}>
          <sphereGeometry args={[0.75, 32, 24]} />
        </mesh>
        {/* playful blobby continents */}
        {[
          [0.5, 0.3, 0.4, 0.32],
          [-0.3, 0.45, 0.5, 0.26],
          [0.1, -0.3, 0.68, 0.24],
          [-0.6, -0.1, -0.3, 0.3],
          [0.35, 0.1, -0.62, 0.22],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={new THREE.Vector3(x, y, z).normalize().multiplyScalar(0.7)} material={toon('#7fd36b')}>
            <sphereGeometry args={[r, 12, 10]} />
          </mesh>
        ))}
        {pins.map((p) => (
          <mesh key={p.id} position={latLngToVec(p.lat!, p.lng!, 0.8)} material={toon(p.status === 'bucket' ? PALETTE.sun : PALETTE.coral)}>
            <sphereGeometry args={[0.05, 8, 6]} />
          </mesh>
        ))}
      </group>
      <mesh position-y={-0.95} material={toon(PALETTE.woodDark)}>
        <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
      </mesh>
      <mesh position-y={-0.1} rotation-x={0.35} material={toon(PALETTE.sun)}>
        <torusGeometry args={[0.86, 0.035, 8, 40, Math.PI]} />
      </mesh>
    </group>
  )
}

function PaperPlane() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * 0.7
    ref.current.position.set(Math.cos(t) * 2.4, 3 + Math.sin(t * 2) * 0.3, Math.sin(t) * 2.4)
    ref.current.rotation.y = -t
  })
  return (
    <group ref={ref} userData={DYNAMIC}>
      <mesh rotation={[0, 0, 0.2]} material={toon('#ffffff')}>
        <coneGeometry args={[0.18, 0.5, 3]} />
      </mesh>
    </group>
  )
}

function Dock({ places }: { places: Place[] }) {
  const boat = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (boat.current) {
      boat.current.position.y = -0.25 + Math.sin(clock.elapsedTime * 1.3) * 0.06
      boat.current.rotation.z = Math.sin(clock.elapsedTime) * 0.05
    }
  })
  return (
    <Hotspot id="dock" labelY={4}>
      {/* pier planks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} castShadow receiveShadow position={[i * 0.55 - 0.6, 0.05, 0]} material={toon(i % 2 ? PALETTE.wood : '#d39a62')}>
          <boxGeometry args={[0.5, 0.1, 1.6]} />
        </mesh>
      ))}
      {[0.6, 2.2, 3.8].flatMap((x) =>
        [-0.8, 0.8].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.25, z]} material={toon(PALETTE.woodDark)}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 6]} />
          </mesh>
        )),
      )}
      <Globe places={places} />
      <AdibaFigure outfit={OUTFITS.adventure} position={[2.9, 0.1, -0.2]} rotation={1.1} scale={0.85} />
      <PaperPlane />
      {/* suitcase */}
      <group position={[1.4, 0.1, -0.4]} rotation-y={0.4}>
        <RoundedBox args={[0.6, 0.45, 0.22]} radius={0.05} position-y={0.22} castShadow material={toon(PALETTE.coral)} />
        <mesh position-y={0.5} material={toon(PALETTE.ink)}>
          <torusGeometry args={[0.08, 0.02, 6, 12, Math.PI]} />
        </mesh>
        <mesh position={[0.1, 0.25, 0.115]} material={toon(PALETTE.sun)}>
          <circleGeometry args={[0.07, 12]} />
        </mesh>
      </group>
      {/* little boat */}
      <group ref={boat} userData={DYNAMIC} position={[3.6, -0.25, 1.6]}>
        <mesh castShadow scale={[1.4, 0.45, 0.6]} material={toon('#ffffff')}>
          <sphereGeometry args={[0.6, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        </mesh>
        <mesh position-y={0.6} material={toon(PALETTE.woodDark)}>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
        </mesh>
        <mesh position={[0.25, 0.7, 0]} rotation-y={Math.PI / 2} material={toon(PALETTE.coral)}>
          <coneGeometry args={[0.35, 0.8, 3]} />
        </mesh>
      </group>
    </Hotspot>
  )
}

/* ---------------------------------------------------------------- cabin */

function Smoke() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    ref.current?.children.forEach((c) => {
      c.position.y += dt * 0.5
      c.scale.multiplyScalar(1 + dt * 0.4)
      if (c.position.y > 1.6) {
        c.position.y = 0
        c.scale.setScalar(0.4)
      }
    })
  })
  return (
    <group ref={ref} userData={DYNAMIC}>
      {[0, 0.55, 1.1].map((y) => (
        <mesh key={y} position-y={y} scale={0.4 + y * 0.4} material={toon('#f2f2f7')}>
          <sphereGeometry args={[0.2, 10, 8]} />
        </mesh>
      ))}
    </group>
  )
}

function Cabin() {
  return (
    <Hotspot id="cabin" labelY={4}>
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position-y={0.2 + i * 0.32}>
          <mesh castShadow position-z={-0.9} rotation-z={Math.PI / 2} material={toon(i % 2 ? '#b97a45' : '#a86b3a')}>
            <cylinderGeometry args={[0.16, 0.16, 2.6, 10]} />
          </mesh>
          {[-1.2, 1.2].map((x) => (
            <mesh key={x} castShadow position-x={x} rotation-x={Math.PI / 2} material={toon(i % 2 ? '#a86b3a' : '#b97a45')}>
              <cylinderGeometry args={[0.16, 0.16, 2, 10]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh castShadow position-y={2.4} rotation-y={Math.PI / 4} scale={[1.3, 1, 1]} material={toon('#5ab36b')}>
        <coneGeometry args={[2, 1.1, 4]} />
      </mesh>
      <mesh castShadow position={[0.7, 2.7, -0.3]} material={toon('#c7c2d6')}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
      </mesh>
      <group position={[0.7, 3.2, -0.3]}>
        <Smoke />
      </group>
      {/* front wall with door */}
      <mesh position={[0, 1, 0.9]} material={toon('#c58b55')}>
        <boxGeometry args={[2.4, 2, 0.1]} />
      </mesh>
      <mesh position={[0, 0.65, 0.96]} material={toon('#7a4a24')}>
        <boxGeometry args={[0.6, 1.1, 0.04]} />
      </mesh>
      <mesh position={[0.75, 1.2, 0.96]} material={toon('#ffe9a6', { emissive: '#ffd66b', emissiveIntensity: 0.5 })}>
        <boxGeometry args={[0.45, 0.45, 0.03]} />
      </mesh>
      {/* giant open storybook */}
      <group position={[-1.5, 0.3, 1.3]} rotation={[-0.4, 0.4, 0]}>
        {[-1, 1].map((s) => (
          <mesh key={s} castShadow position-x={s * 0.32} rotation-y={s * -0.2} material={toon('#fffdf3')}>
            <boxGeometry args={[0.62, 0.04, 0.8]} />
          </mesh>
        ))}
        <mesh position-y={-0.03} material={toon('#5ab36b')}>
          <boxGeometry args={[1.32, 0.03, 0.86]} />
        </mesh>
      </group>
    </Hotspot>
  )
}

/* -------------------------------------------------------------- mailbox */

function Mailbox() {
  const flag = useRef<THREE.Group>(null)
  const panelOpen = useIsland((s) => s.panelOpen)
  const focus = useIsland((s) => s.focus)
  const up = panelOpen && focus === 'mailbox'
  useFrame(() => {
    if (flag.current) flag.current.rotation.z = THREE.MathUtils.lerp(flag.current.rotation.z, up ? 0 : -Math.PI / 2, 0.1)
  })
  return (
    <Hotspot id="mailbox" labelY={2.6}>
      <mesh castShadow position-y={0.55} material={toon(PALETTE.wood)}>
        <boxGeometry args={[0.14, 1.1, 0.14]} />
      </mesh>
      <group position-y={1.25}>
        <mesh castShadow position-y={-0.08} material={toon(PALETTE.blue)}>
          <boxGeometry args={[0.5, 0.36, 0.8]} />
        </mesh>
        <mesh castShadow position-y={0.1} rotation-x={Math.PI / 2} material={toon(PALETTE.blue)}>
          <cylinderGeometry args={[0.25, 0.25, 0.8, 16, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh position-z={0.41} material={toon('#1d4fc2')}>
          <circleGeometry args={[0.2, 16]} />
        </mesh>
        <group ref={flag} userData={DYNAMIC} position={[0.27, -0.05, -0.2]}>
          <mesh position-y={0.22} material={toon('#999')}>
            <boxGeometry args={[0.03, 0.44, 0.03]} />
          </mesh>
          <mesh position={[0, 0.38, 0.1]} material={toon(PALETTE.coral)}>
            <boxGeometry args={[0.03, 0.14, 0.2]} />
          </mesh>
        </group>
      </group>
      <FloatingHearts />
    </Hotspot>
  )
}

function FloatingHearts() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    ref.current?.children.forEach((c, i) => {
      const t = (clock.elapsedTime * 0.4 + i * 0.33) % 1
      c.position.set(Math.sin(t * 6 + i) * 0.3, 1.6 + t * 1.2, 0.2)
      c.scale.setScalar(Math.sin(t * Math.PI) * 0.9)
    })
  })
  return (
    <group ref={ref} userData={DYNAMIC}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={toon(PALETTE.pink)}>
          <sphereGeometry args={[0.07, 8, 6]} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------- memory lane */

const TRACK = { rx: 1.7, rz: 1.15 }

function ToyTrain() {
  const train = useRef<THREE.Group>(null)
  const colors = [PALETTE.coral, PALETTE.sun, PALETTE.teal, PALETTE.lilac]
  useFrame(({ clock }) => {
    train.current?.children.forEach((car, i) => {
      const t = clock.elapsedTime * 0.45 - i * 0.42
      const x = Math.cos(t) * TRACK.rx
      const z = Math.sin(t) * TRACK.rz
      car.position.set(x, 0.18, z)
      // face along the direction of travel
      car.rotation.y = Math.atan2(-Math.cos(t) * TRACK.rz, -Math.sin(t) * TRACK.rx)
    })
  })
  return (
    <group ref={train} userData={DYNAMIC}>
      {/* engine */}
      <group userData={DYNAMIC}>
        <StaticMerge>
          <RoundedBox args={[0.55, 0.3, 0.34]} radius={0.06} position-y={0.12} castShadow material={toon(PALETTE.blue)} />
          <mesh castShadow position={[0.1, 0.32, 0]} rotation-z={Math.PI / 2} material={toon(PALETTE.coral)}>
            <cylinderGeometry args={[0.14, 0.14, 0.36, 14]} />
          </mesh>
          <RoundedBox args={[0.22, 0.3, 0.32]} radius={0.04} position={[-0.18, 0.38, 0]} castShadow material={toon(PALETTE.coral)} />
          <mesh position={[0.22, 0.5, 0]} material={toon(PALETTE.ink)}>
            <cylinderGeometry args={[0.05, 0.07, 0.16, 8]} />
          </mesh>
          {[-0.17, 0.17].flatMap((x) =>
            [-0.18, 0.18].map((z) => (
              <mesh key={`${x}${z}`} position={[x, 0, z]} rotation-x={Math.PI / 2} material={toon(PALETTE.ink)}>
                <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
              </mesh>
            )),
          )}
        </StaticMerge>
      </group>
      {colors.map((c) => (
        <group key={c} userData={DYNAMIC}>
          <StaticMerge>
            <RoundedBox args={[0.44, 0.24, 0.32]} radius={0.05} position-y={0.12} castShadow material={toon(c)} />
            <RoundedBox args={[0.2, 0.2, 0.2]} radius={0.04} position-y={0.34} rotation-y={0.4} castShadow material={toon(PALETTE.white)} />
            {[-0.14, 0.14].flatMap((x) =>
              [-0.17, 0.17].map((z) => (
                <mesh key={`${x}${z}`} position={[x, 0, z]} rotation-x={Math.PI / 2} material={toon(PALETTE.ink)}>
                  <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
                </mesh>
              )),
            )}
          </StaticMerge>
        </group>
      ))}
    </group>
  )
}

function MemoryLane() {
  return (
    <Hotspot id="timeline" labelY={2.4}>
      {/* oval track */}
      <mesh receiveShadow position-y={0.04} rotation-x={-Math.PI / 2} scale={[TRACK.rx, TRACK.rz, 1]} material={toon('#8a8fa3')}>
        <ringGeometry args={[0.92, 1.08, 48]} />
      </mesh>
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * TRACK.rx, 0.03, Math.sin(a) * TRACK.rz]} rotation-y={-a} material={toon(PALETTE.woodDark)}>
            <boxGeometry args={[0.36, 0.04, 0.08]} />
          </mesh>
        )
      })}
      {/* little station with year flags */}
      <RoundedBox args={[0.9, 0.5, 0.5]} radius={0.06} position={[0, 0.25, 0]} castShadow material={toon('#ffe2b8')} />
      <mesh castShadow position-y={0.68} rotation-y={Math.PI / 4} material={toon(PALETTE.coral)}>
        <coneGeometry args={[0.6, 0.4, 4]} />
      </mesh>
      {['#ff7eb6', '#ffd23f', '#2fc4c9'].map((c, i) => (
        <group key={c} position={[-0.3 + i * 0.3, 0.9, 0]}>
          <mesh material={toon(PALETTE.woodDark)} position-y={0.2}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 5]} />
          </mesh>
          <mesh material={toon(c)} position={[0.08, 0.34, 0]}>
            <boxGeometry args={[0.16, 0.1, 0.02]} />
          </mesh>
        </group>
      ))}
      <ToyTrain />
    </Hotspot>
  )
}

/* ---------------------------------------------------------- beach life */

function BeachLounge() {
  const { x, z, rotation } = BEACH_FIGURES.lounging
  const towel = useMemo(() => toonTextured(patternTexture('stripes', '#2fc4c9', '#ffffff', 3)), [])
  const umbrella = useMemo(() => toonTextured(patternTexture('stripes', '#ff7eb6', '#fff4fb', 4)), [])
  return (
    <group position={[x, 0, z]} rotation-y={rotation}>
      <StaticMerge>
        <mesh receiveShadow position-y={0.02} material={towel}>
          <boxGeometry args={[1, 0.02, 1.7]} />
        </mesh>
        <mesh castShadow position={[0.75, 1, -0.3]} material={toon(PALETTE.white)}>
          <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
        </mesh>
        <mesh castShadow position={[0.75, 2, -0.3]} material={umbrella}>
          <coneGeometry args={[1.25, 0.55, 16, 1, true]} />
        </mesh>
        <mesh position={[-0.55, 0.12, 0.6]} material={toon('#ff6f61')}>
          <sphereGeometry args={[0.16, 14, 10]} />
        </mesh>
      </StaticMerge>
      <AdibaFigure outfit={OUTFITS.whiteEmbroidery} position={[0, 0.02, -0.25]} scale={0.9} />
    </group>
  )
}

function SeasideStroll() {
  const { x, z, rotation } = BEACH_FIGURES.seaside
  return <AdibaFigure outfit={OUTFITS.seaside} position={[x, 0, z]} rotation={rotation} scale={0.9} />
}

/* ---------------------------------------------------------------- scene */

export function Structures({ projects, places, name, nickname }: { projects: Project[]; places: Place[]; name: string; nickname: string }) {
  return (
    <>
      <Welcome name={name} nickname={nickname} />
      <MemoryLane />
      <BeachLounge />
      <SeasideStroll />
      <Workshop projects={projects} />
      <BlockTower />
      <Lighthouse />
      <Stage />
      <Boutique />
      <Shack />
      <Dock places={places} />
      <Cabin />
      <Mailbox />
      <Hotspot id="hammock" labelY={3.3}>
        <PennyHammock position={[0, 0, 0]} />
      </Hotspot>
    </>
  )
}
