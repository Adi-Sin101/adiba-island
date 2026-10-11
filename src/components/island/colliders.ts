import { BUSHES, PALMS, ROCKS } from './Environment'
import { ZONES, type ZoneId } from './zones'

export type Collider = { x: number; z: number; r: number }

/** Adiba figures relaxing on the sand outside any zone (world coordinates). */
export const BEACH_FIGURES = {
  lounging: { x: -8.4, z: 9.7, rotation: 0.7 },
  seaside: { x: 9.7, z: -8.9, rotation: 2.3 },
}

// Rough footprint of each building, so Boop walks around instead of through it.
const ZONE_RADIUS: Partial<Record<ZoneId, number>> = {
  welcome: 1.5,
  workshop: 2.3,
  blocks: 1.5,
  lighthouse: 1.8,
  stage: 2.2,
  boutique: 2,
  shack: 1.9,
  dock: 0.9,
  cabin: 1.8,
  hammock: 1.9,
  mailbox: 0.6,
  timeline: 0.5,
}

export const HILL: Collider = { x: 0.4, z: -2.2, r: 3.4 }

export const COLLIDERS: Collider[] = [
  HILL,
  ...ZONES.flatMap((z) => (ZONE_RADIUS[z.id] ? [{ x: z.at[0], z: z.at[1], r: ZONE_RADIUS[z.id]! }] : [])),
  ...PALMS.map((p) => ({ x: p.position[0], z: p.position[2], r: 0.45 * (p.scale ?? 1) })),
  ...ROCKS.map((r) => ({ x: r.position[0], z: r.position[2], r: 0.55 * r.scale })),
  ...BUSHES.map((b) => ({ x: b.position[0], z: b.position[2], r: 0.7 * (b.scale ?? 1) })),
  { x: BEACH_FIGURES.lounging.x, z: BEACH_FIGURES.lounging.z, r: 1.3 },
  { x: BEACH_FIGURES.seaside.x, z: BEACH_FIGURES.seaside.z, r: 0.5 },
]

const BODY = 0.45

/** Pushes a point out of every collider it overlaps (a couple of passes settles corners). */
export function resolveCollisions(x: number, z: number) {
  for (let pass = 0; pass < 2; pass++) {
    for (const c of COLLIDERS) {
      const dx = x - c.x
      const dz = z - c.z
      const d = Math.hypot(dx, dz)
      const min = c.r + BODY
      if (d < min) {
        const nx = d > 1e-4 ? dx / d : 1
        const nz = d > 1e-4 ? dz / d : 0
        x = c.x + nx * min
        z = c.z + nz * min
      }
    }
  }
  return { x, z }
}
