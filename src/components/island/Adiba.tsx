'use client'

import { Outlines } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { PALETTE, patternTexture, toon, toonTextured } from './materials'
import { DYNAMIC, StaticMerge } from './StaticMerge'

/** Outfits taken from Adiba's own photos. */
export type Outfit = {
  /** dress = one-piece; pants = top + trousers */
  kind: 'dress' | 'pants'
  dress?: string
  pattern?: { kind: 'gingham' | 'stripes'; a: string; b: string }
  sleeves?: 'puff' | 'short' | 'long' | 'none'
  top?: string
  pants?: string
  jacket?: string
  dupatta?: string
  hat?: 'straw'
  sunglasses?: boolean
  prop?: 'wave' | 'mic' | 'papers' | 'bouquet' | 'clutch' | 'plate'
  pose?: 'stand' | 'sit'
}

export const OUTFITS = {
  gingham: { kind: 'dress', pattern: { kind: 'gingham', a: '#ff86b8', b: '#ffffff' }, sleeves: 'puff', prop: 'wave' },
  adventure: { kind: 'pants', top: '#6d7a4a', pants: '#cbb48a', sleeves: 'long', hat: 'straw', prop: 'wave' },
  littleBlack: { kind: 'dress', dress: '#1d1b26', sleeves: 'none', prop: 'clutch' },
  festive: { kind: 'dress', dress: '#c8102e', sleeves: 'long', dupatta: '#e8b04a', prop: 'mic' },
  denim: { kind: 'pants', top: '#f3f0e6', pants: '#2b2b38', jacket: '#4c6fb5', sleeves: 'long', prop: 'plate' },
  emerald: { kind: 'dress', dress: '#1f6f5c', sleeves: 'short', prop: 'papers' },
  whiteEmbroidery: { kind: 'dress', dress: '#f7f4ec', sleeves: 'long', dupatta: '#ffffff', pose: 'sit' },
  seaside: { kind: 'dress', pattern: { kind: 'stripes', a: '#1d6b8f', b: '#e9f3f7' }, sleeves: 'short', sunglasses: true },
} satisfies Record<string, Outfit>

const OUTLINE = { thickness: 0.035, color: PALETTE.ink } as const

export function AdibaFigure({
  outfit = OUTFITS.gingham,
  position,
  rotation = 0,
  scale = 1,
}: {
  outfit?: Outfit
  position: [number, number, number]
  rotation?: number
  scale?: number
}) {
  const root = useRef<THREE.Group>(null)
  const arm = useRef<THREE.Group>(null)
  const seed = useMemo(() => Math.random() * 10, [])
  const sitting = outfit.pose === 'sit'

  const dressMat = useMemo(
    () =>
      outfit.pattern
        ? toonTextured(patternTexture(outfit.pattern.kind, outfit.pattern.a, outfit.pattern.b, 6))
        : toon(outfit.dress ?? outfit.top ?? PALETTE.pink),
    [outfit],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + seed
    if (root.current) root.current.position.y = position[1] + (sitting ? 0 : Math.abs(Math.sin(t * 2)) * 0.035)
    if (arm.current && outfit.prop === 'wave') arm.current.rotation.z = -2.5 + Math.sin(t * 4) * 0.35
  })

  const skin = toon(PALETTE.skin)
  const hair = toon(PALETTE.hair)
  const sleeveMat = outfit.jacket ? toon(outfit.jacket) : outfit.kind === 'pants' ? toon(outfit.top ?? '#fff') : dressMat
  const bareArms = outfit.sleeves === 'none'
  const hipY = sitting ? 0.32 : 0.62

  return (
    <group ref={root} userData={DYNAMIC} position={position} rotation-y={rotation} scale={scale}>
      <StaticMerge>
        {/* legs */}
        {[-0.13, 0.13].map((x) =>
          sitting ? (
            <group key={x}>
              <mesh castShadow position={[x, 0.12, 0.3]} rotation-x={Math.PI / 2} material={outfit.kind === 'pants' ? toon(outfit.pants!) : skin}>
                <cylinderGeometry args={[0.07, 0.07, 0.5, 8]} />
              </mesh>
              <mesh position={[x, 0.1, 0.58]} scale={[1, 1.4, 0.6]} material={toon(PALETTE.coral)}>
                <sphereGeometry args={[0.09, 10, 8]} />
              </mesh>
            </group>
          ) : (
            <group key={x}>
              <mesh castShadow position={[x, 0.22, 0]} material={outfit.kind === 'pants' ? toon(outfit.pants!) : skin}>
                <cylinderGeometry args={[outfit.kind === 'pants' ? 0.085 : 0.07, 0.07, 0.44, 8]} />
              </mesh>
              <mesh position={[x, 0.03, 0.05]} scale={[1, 0.4, 1.5]} material={toon(outfit.kind === 'pants' ? '#5b3a29' : PALETTE.coral)}>
                <sphereGeometry args={[0.1, 10, 8]} />
              </mesh>
            </group>
          ),
        )}

        {/* body */}
        {outfit.kind === 'dress' ? (
          <mesh castShadow position-y={sitting ? 0.42 : 0.78} scale={sitting ? [1.1, 0.7, 1.1] : 1} material={dressMat}>
            <coneGeometry args={[0.62, 1.05, 24, 1, true]} />
          </mesh>
        ) : (
          <>
            <mesh castShadow position-y={hipY + 0.05} material={toon(outfit.pants!)}>
              <cylinderGeometry args={[0.24, 0.26, 0.22, 16]} />
            </mesh>
            <mesh castShadow position-y={hipY + 0.42} material={toon(outfit.top!)}>
              <cylinderGeometry args={[0.24, 0.27, 0.56, 16]} />
            </mesh>
            {outfit.jacket &&
              [-1, 1].map((s) => (
                <mesh key={s} castShadow position={[s * 0.16, hipY + 0.42, 0.02]} rotation-y={s * 0.25} material={toon(outfit.jacket!)}>
                  <boxGeometry args={[0.2, 0.6, 0.54]} />
                </mesh>
              ))}
          </>
        )}
        <mesh castShadow position-y={(sitting ? 0.32 : 0.62) + 0.58} scale={[0.32, 0.26, 0.24]} material={outfit.kind === 'pants' ? toon(outfit.jacket ?? outfit.top!) : dressMat}>
          <sphereGeometry args={[1, 18, 14]} />
        </mesh>
        {bareArms && (
          <mesh position-y={hipY + 0.72} material={skin}>
            <cylinderGeometry args={[0.2, 0.3, 0.12, 16]} />
          </mesh>
        )}

        {/* sleeves */}
        {!bareArms &&
          [-1, 1].map((s) => (
            <mesh key={s} castShadow position={[s * 0.33, hipY + 0.7, 0]} scale={outfit.sleeves === 'puff' ? 1 : 0.75} material={sleeveMat}>
              <sphereGeometry args={[0.15, 14, 10]} />
            </mesh>
          ))}

        {/* left arm (static) */}
        <group position={[-0.38, hipY + 0.68, 0]} rotation={[outfit.prop === 'papers' || outfit.prop === 'plate' ? -0.9 : 0, 0, 0.25]}>
          <mesh castShadow position-y={-0.26} material={outfit.sleeves === 'long' ? sleeveMat : skin}>
            <capsuleGeometry args={[0.055, 0.38, 4, 8]} />
          </mesh>
        </group>

        {/* dupatta draped over one shoulder */}
        {outfit.dupatta && (
          <>
            <mesh castShadow position={[0.05, hipY + 0.45, 0.2]} rotation={[0.1, 0, -0.7]} material={toon(outfit.dupatta)}>
              <boxGeometry args={[0.16, 1.05, 0.04]} />
            </mesh>
            <mesh castShadow position={[0.3, hipY + 0.25, -0.12]} rotation={[0.2, 0, 0.1]} material={toon(outfit.dupatta)}>
              <boxGeometry args={[0.16, 0.9, 0.04]} />
            </mesh>
          </>
        )}

        {/* head */}
        <group position-y={hipY + 1.2}>
          <mesh castShadow scale={[0.36, 0.38, 0.35]} material={skin}>
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>
          <mesh castShadow position={[0, 0.06, -0.05]} scale={[0.4, 0.42, 0.38]} material={hair}>
            <sphereGeometry args={[1, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          </mesh>
          <mesh castShadow position={[0, -0.32, -0.18]} scale={[0.38, 0.62, 0.2]} material={hair}>
            <sphereGeometry args={[1, 18, 14]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} castShadow position={[s * 0.3, -0.22, 0.02]} scale={[0.1, 0.42, 0.14]} material={hair}>
              <sphereGeometry args={[1, 12, 10]} />
            </mesh>
          ))}
          {outfit.sunglasses ? (
            [-0.12, 0.12].map((x) => (
              <mesh key={x} position={[x, 0.01, 0.33]} material={toon('#14121c')}>
                <boxGeometry args={[0.16, 0.09, 0.04]} />
              </mesh>
            ))
          ) : (
            [-0.12, 0.12].map((x) => (
              <mesh key={x} position={[x, 0.0, 0.32]} scale={[0.05, 0.065, 0.03]} material={toon('#1b1020')}>
                <sphereGeometry args={[1, 10, 8]} />
              </mesh>
            ))
          )}
          {[-0.2, 0.2].map((x) => (
            <mesh key={x} position={[x, -0.1, 0.28]} scale={[0.06, 0.035, 0.02]} material={toon('#ff9fb5')}>
              <sphereGeometry args={[1, 10, 8]} />
            </mesh>
          ))}
          <mesh position={[0, -0.13, 0.33]} rotation-z={Math.PI} material={toon('#b2384f')}>
            <torusGeometry args={[0.055, 0.014, 6, 12, Math.PI]} />
          </mesh>
          {outfit.hat === 'straw' ? (
            <>
              <mesh castShadow position-y={0.3} material={toon('#e6c27a')}>
                <cylinderGeometry args={[0.62, 0.62, 0.03, 24]} />
              </mesh>
              <mesh castShadow position-y={0.42} material={toon('#d9b066')}>
                <cylinderGeometry args={[0.26, 0.32, 0.24, 18]} />
              </mesh>
            </>
          ) : (
            <mesh position={[0.24, 0.22, 0.22]} material={toon(PALETTE.pink)}>
              <sphereGeometry args={[0.06, 10, 8]} />
            </mesh>
          )}
        </group>

        {/* props held in the left hand area */}
        {outfit.prop === 'papers' && (
          <mesh position={[-0.32, hipY + 0.5, 0.36]} rotation-x={-0.6} material={toon('#ffffff')}>
            <boxGeometry args={[0.32, 0.03, 0.42]} />
          </mesh>
        )}
        {outfit.prop === 'plate' && (
          <group position={[-0.34, hipY + 0.5, 0.36]}>
            <mesh material={toon('#ffffff')}>
              <cylinderGeometry args={[0.18, 0.14, 0.03, 16]} />
            </mesh>
            <mesh position-y={0.05} scale={[1, 0.5, 1]} material={toon('#ff8f6b')}>
              <sphereGeometry args={[0.1, 10, 8]} />
            </mesh>
          </group>
        )}
        {outfit.prop === 'clutch' && (
          <mesh position={[-0.42, hipY + 0.32, 0.08]} material={toon('#d4af37')}>
            <boxGeometry args={[0.2, 0.12, 0.06]} />
          </mesh>
        )}
      </StaticMerge>

      {/* outlines only on the silhouette pieces that matter */}
      <mesh position-y={hipY + 1.2} scale={[0.36, 0.38, 0.35]} material={skin}>
        <sphereGeometry args={[1, 24, 18]} />
        <Outlines {...OUTLINE} />
      </mesh>

      {/* right arm: waves, holds the mic, or rests */}
      <group
        ref={arm}
        userData={DYNAMIC}
        position={[0.38, hipY + 0.7, 0]}
        rotation={outfit.prop === 'wave' ? [0, 0, -2.5] : outfit.prop === 'mic' ? [-1.3, 0, -0.2] : [0, 0, -0.25]}
      >
        <mesh castShadow position-y={-0.26} material={outfit.sleeves === 'long' ? sleeveMat : skin}>
          <capsuleGeometry args={[0.055, 0.38, 4, 8]} />
        </mesh>
        {outfit.prop === 'mic' && (
          <mesh position={[0, -0.52, 0.04]} material={toon('#2b2b38')}>
            <cylinderGeometry args={[0.035, 0.025, 0.2, 8]} />
          </mesh>
        )}
      </group>
    </group>
  )
}
