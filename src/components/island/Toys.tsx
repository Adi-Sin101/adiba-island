'use client'

import { RoundedBox } from '@react-three/drei'
import { PALETTE, toon } from './materials'

// Little toys that stand for projects on the workshop shelves. Each fits in ~0.6 units.

export function Rocket({ color = PALETTE.coral }: { color?: string }) {
  return (
    <group>
      <mesh castShadow position-y={0.3} material={toon('#f4f4ff')}>
        <capsuleGeometry args={[0.12, 0.3, 6, 12]} />
      </mesh>
      <mesh castShadow position-y={0.6} material={toon(color)}>
        <coneGeometry args={[0.12, 0.18, 12]} />
      </mesh>
      <mesh position={[0, 0.36, 0.11]} material={toon(PALETTE.teal)}>
        <sphereGeometry args={[0.05, 10, 8]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 0.12, 0.1, Math.sin((i * Math.PI * 2) / 3) * 0.12]} rotation-y={-(i * Math.PI * 2) / 3} material={toon(color)}>
          <boxGeometry args={[0.1, 0.16, 0.02]} />
        </mesh>
      ))}
    </group>
  )
}

export function Robot({ color = PALETTE.teal }: { color?: string }) {
  return (
    <group>
      <RoundedBox args={[0.3, 0.28, 0.22]} radius={0.05} position-y={0.2} castShadow material={toon(color)} />
      <RoundedBox args={[0.24, 0.2, 0.2]} radius={0.05} position-y={0.47} castShadow material={toon('#dfe6f5')} />
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.49, 0.1]} material={toon(PALETTE.ink)}>
          <sphereGeometry args={[0.03, 8, 6]} />
        </mesh>
      ))}
      <mesh position-y={0.64} material={toon(PALETTE.coral)}>
        <sphereGeometry args={[0.035, 8, 6]} />
      </mesh>
      <mesh position-y={0.6} material={toon('#888')}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 4]} />
      </mesh>
    </group>
  )
}

export function ToyCar({ color = PALETTE.blue }: { color?: string }) {
  return (
    <group>
      <RoundedBox args={[0.5, 0.14, 0.26]} radius={0.05} position-y={0.14} castShadow material={toon(color)} />
      <RoundedBox args={[0.26, 0.13, 0.22]} radius={0.05} position={[-0.03, 0.26, 0]} castShadow material={toon('#cfe9ff')} />
      {[-0.16, 0.16].flatMap((x) =>
        [-0.13, 0.13].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.07, z]} rotation-x={Math.PI / 2} material={toon(PALETTE.ink)}>
            <cylinderGeometry args={[0.065, 0.065, 0.05, 12]} />
          </mesh>
        )),
      )}
    </group>
  )
}

export function Teddy({ color = '#c8874f' }: { color?: string }) {
  const fur = toon(color)
  return (
    <group>
      <mesh castShadow position-y={0.17} scale={[1, 1.1, 0.9]} material={fur}>
        <sphereGeometry args={[0.15, 14, 12]} />
      </mesh>
      <mesh castShadow position-y={0.4} material={fur}>
        <sphereGeometry args={[0.12, 14, 12]} />
      </mesh>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} material={fur}>
          <sphereGeometry args={[0.045, 8, 6]} />
        </mesh>
      ))}
      <mesh position={[0, 0.38, 0.1]} material={toon('#f2d2b0')}>
        <sphereGeometry args={[0.05, 8, 6]} />
      </mesh>
      <mesh position={[0, 0.27, 0.11]} rotation-z={Math.PI / 4} material={toon(PALETTE.pink)}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
      </mesh>
    </group>
  )
}

export function Duck() {
  return (
    <group>
      <mesh castShadow position-y={0.13} scale={[1.2, 0.85, 1]} material={toon(PALETTE.sun)}>
        <sphereGeometry args={[0.15, 14, 12]} />
      </mesh>
      <mesh castShadow position={[0.1, 0.3, 0]} material={toon(PALETTE.sun)}>
        <sphereGeometry args={[0.1, 14, 12]} />
      </mesh>
      <mesh position={[0.2, 0.29, 0]} scale={[1, 0.45, 1]} material={toon('#ff8a1f')}>
        <sphereGeometry args={[0.05, 10, 8]} />
      </mesh>
    </group>
  )
}

export function Top({ color = PALETTE.lilac }: { color?: string }) {
  return (
    <group>
      <mesh castShadow position-y={0.2} material={toon(color)}>
        <coneGeometry args={[0.2, 0.26, 16]} />
      </mesh>
      <mesh castShadow position-y={0.36} rotation-x={Math.PI} material={toon(PALETTE.sun)}>
        <coneGeometry args={[0.2, 0.08, 16]} />
      </mesh>
      <mesh position-y={0.46} material={toon(PALETTE.wood)}>
        <cylinderGeometry args={[0.025, 0.025, 0.14, 6]} />
      </mesh>
    </group>
  )
}

export function Gift({ color = PALETTE.pink }: { color?: string }) {
  return (
    <group>
      <RoundedBox args={[0.34, 0.3, 0.34]} radius={0.03} position-y={0.15} castShadow material={toon(color)} />
      <mesh position-y={0.15} material={toon(PALETTE.sun)}>
        <boxGeometry args={[0.36, 0.31, 0.07]} />
      </mesh>
      <mesh position-y={0.15} material={toon(PALETTE.sun)}>
        <boxGeometry args={[0.07, 0.31, 0.36]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.06, 0.34, 0]} rotation-z={s * 0.6} material={toon(PALETTE.sun)}>
          <torusGeometry args={[0.05, 0.018, 6, 12]} />
        </mesh>
      ))}
    </group>
  )
}

export function Blocks() {
  const colors = [PALETTE.coral, PALETTE.blue, PALETTE.sun]
  return (
    <group>
      {colors.map((c, i) => (
        <RoundedBox key={c} args={[0.2, 0.2, 0.2]} radius={0.03} position={[i === 2 ? 0 : (i - 0.5) * 0.22, i === 2 ? 0.31 : 0.1, 0]} rotation-y={i * 0.3} castShadow material={toon(c)} />
      ))}
    </group>
  )
}

export const TOY_COMPONENTS: Record<string, (props: { color?: string }) => React.JSX.Element> = {
  rocket: Rocket,
  robot: Robot,
  car: ToyCar,
  teddy: Teddy,
  duck: Duck,
  top: Top,
  gift: Gift,
  blocks: Blocks,
}
