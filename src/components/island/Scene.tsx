'use client'

import { CameraControls, PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import type { SiteContent } from '@/lib/types'
import { Boop } from './Characters'
import { resolveCollisions } from './colliders'
import { Clouds, IslandGround, Ocean, Scenery } from './Environment'
import { playWhoosh } from './sound'
import { live, useIsland } from './store'
import { Structures } from './Structures'
import { ISLAND_RADIUS, ZONES, zoneById } from './zones'


/* ------------------------------------------------------------ camera rig */

function CameraRig() {
  const controls = useRef<CameraControls>(null)
  const focus = useIsland((s) => s.focus)
  const panelOpen = useIsland((s) => s.panelOpen)
  const mode = useIsland((s) => s.mode)
  const ready = useIsland((s) => s.ready)
  const sound = useIsland((s) => s.ambience)
  const size = useThree((s) => s.size)
  const portrait = size.width < size.height
  const wide = size.width >= 900

  // Fly to the whole island, a zone, or behind the mascot.
  useEffect(() => {
    const c = controls.current
    if (!c || !ready || mode === 'play') return
    if (!focus) {
      const far = portrait ? 1.45 : 1
      void c.setLookAt(0, 13 * far, 29 * far, 0, 1, 0, true)
      void c.setFocalOffset(0, 0, 0, true)
      return
    }
    const zone = zoneById(focus)
    const [x, z] = zone.at
    const dir = new THREE.Vector2(Math.sin(zone.facing), Math.cos(zone.facing))
    const d = zone.distance * 1.3 * (portrait ? 1.4 : 1)
    void c.setLookAt(x + dir.x * d * 0.85, zone.lookY + d * 0.55, z + dir.y * d * 0.85, x, zone.lookY, z, true)
    // keep the model visible beside the side panel on wide screens, above the sheet on phones
    if (panelOpen && wide) void c.setFocalOffset(d * 0.28, 0, 0, true)
    else if (panelOpen && !wide) void c.setFocalOffset(0, -d * 0.42, 0, true)
    else void c.setFocalOffset(0, 0, 0, true)
    if (sound) playWhoosh()
  }, [focus, panelOpen, mode, ready, portrait, wide, sound])

  useEffect(() => {
    if (mode === 'play') void controls.current?.setFocalOffset(0, 0, 0, true)
  }, [mode])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') (window as unknown as { __cam: unknown }).__cam = controls.current
  }, [])

  useFrame(() => {
    const c = controls.current
    if (!c || mode !== 'play') return
    const m = live.mascot
    void c.setLookAt(m.x, 7, m.z + 9.5, m.x, 0.8, m.z, true)
  })

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.55}
      minDistance={4}
      maxDistance={60}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2.15}
      truckSpeed={0}
      enabled={mode === 'tour'}
      // drag to orbit, wheel / pinch to zoom; sections only change on a tap
      mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 16 }}
      dollySpeed={0.6}
      touches={{ one: 64, two: 1024, three: 0 }}
    />
  )
}

/* ------------------------------------------------------- play controller */

function PlayController() {
  const mode = useIsland((s) => s.mode)
  const setNearby = useIsland((s) => s.setNearby)

  useFrame((_, dt) => {
    if (mode !== 'play') return
    const m = live.mascot
    const k = live.keys
    let dx = live.joystick.x
    let dz = -live.joystick.y
    if (k.has('a') || k.has('arrowleft')) dx -= 1
    if (k.has('d') || k.has('arrowright')) dx += 1
    if (k.has('w') || k.has('arrowup')) dz -= 1
    if (k.has('s') || k.has('arrowdown')) dz += 1
    const len = Math.hypot(dx, dz)
    const speed = 5.2
    if (len > 0.05) {
      const step = Math.min(dt, 0.05) * speed
      let nx = m.x + (dx / Math.max(len, 1)) * step
      let nz = m.z + (dz / Math.max(len, 1)) * step
      // stay on the island
      const r = Math.hypot(nx, nz)
      if (r > ISLAND_RADIUS - 0.6) {
        nx *= (ISLAND_RADIUS - 0.6) / r
        nz *= (ISLAND_RADIUS - 0.6) / r
      }
      // walk around buildings, trees, rocks and the hill instead of through them
      const solved = resolveCollisions(nx, nz)
      m.x = solved.x
      m.z = solved.z
      const target = Math.atan2(dx, dz)
      let diff = target - m.heading
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      m.heading += diff * Math.min(1, dt * 10)
      m.speed = len
    } else {
      m.speed = 0
    }

    let closest: (typeof ZONES)[number] | null = null
    let best = 3.1
    for (const z of ZONES) {
      const d = Math.hypot(z.at[0] - m.x, z.at[1] - m.z)
      if (d < best) {
        best = d
        closest = z
      }
    }
    setNearby(closest?.id ?? null)
  })
  return null
}

/* --------------------------------------------------------------- shadows */

/** Re-render the shadow map at ~20 fps instead of every frame; nobody can tell, the GPU can. */
function ShadowThrottle() {
  const gl = useThree((s) => s.gl)
  const frame = useRef(0)
  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    return () => {
      gl.shadowMap.autoUpdate = true
    }
  }, [gl])
  useFrame(() => {
    if (frame.current++ % 3 === 0) gl.shadowMap.needsUpdate = true
  })
  return null
}

/* ----------------------------------------------------------------- ready */

function ReadySignal() {
  const setReady = useIsland((s) => s.setReady)
  const frames = useRef(0)
  useFrame(() => {
    frames.current++
    if (frames.current === 20) setReady()
  })
  return null
}

/* ----------------------------------------------------------------- scene */

export default function Scene({ content }: { content: SiteContent }) {
  const [dpr, setDpr] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 1.75))
  const small = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, dpr]}
      camera={{ position: [0, 46, 70], fov: 38, near: 0.5, far: 220 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        if (process.env.NODE_ENV !== 'production') (window as unknown as { __gl: unknown }).__gl = gl
      }}
      onPointerMove={(e) => {
        live.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        live.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      }}
      aria-label="Interactive 3D island. Use the menu buttons to open each section."
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(small ? 1.5 : 1.75)} />
      <fog attach="fog" args={['#bfe6ff', 60, 140]} />
      <hemisphereLight args={['#dff1ff', '#ffe2a8', 1.25]} />
      <directionalLight
        castShadow
        position={[14, 22, 10]}
        intensity={2.3}
        color="#fff4dc"
        shadow-mapSize={small ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-far={60}
      />
      <ambientLight intensity={0.25} />

      <Ocean />
      <IslandGround />
      <Scenery />
      <Clouds />
      <Structures
        projects={content.projects}
        places={content.places}
        name={content.profile.name}
        nickname={content.profile.nickname}
      />
      <Boop />

      <CameraRig />
      <PlayController />
      <ReadySignal />
      <ShadowThrottle />
    </Canvas>
  )
}
