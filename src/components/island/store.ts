'use client'

import { create } from 'zustand'
import { ZONES, type ZoneId } from './zones'

type Mode = 'tour' | 'play'

type IslandState = {
  /** Zone the camera is looking at (null = whole island). */
  focus: ZoneId | null
  /** Whether the content panel for the focused zone is open. */
  panelOpen: boolean
  mode: Mode
  ready: boolean
  /** Background music (the island radio). */
  sound: boolean
  /** Beach sounds: ocean waves plus click pops. */
  ambience: boolean
  selectedProject: string | null
  pennyAwake: number
  /** Zone the mascot is standing next to in play mode. */
  nearby: ZoneId | null

  open: (zone: ZoneId, opts?: { project?: string }) => void
  close: () => void
  overview: () => void
  step: (dir: 1 | -1) => void
  setMode: (mode: Mode) => void
  setReady: () => void
  toggleSound: () => void
  toggleAmbience: () => void
  wakePenny: () => void
  setNearby: (zone: ZoneId | null) => void
  selectProject: (slug: string | null) => void
}

export const useIsland = create<IslandState>((set, get) => ({
  focus: null,
  panelOpen: false,
  mode: 'tour',
  ready: false,
  sound: false,
  ambience: false,
  selectedProject: null,
  pennyAwake: 0,
  nearby: null,

  open: (zone, opts) =>
    set({ focus: zone, panelOpen: true, selectedProject: opts?.project ?? null, ...(zone === 'hammock' ? { pennyAwake: Date.now() } : {}) }),
  close: () => set({ panelOpen: false, selectedProject: null }),
  overview: () => set({ focus: null, panelOpen: false, selectedProject: null }),
  step: (dir) => {
    const { focus } = get()
    const index = focus ? ZONES.findIndex((z) => z.id === focus) : -1
    const next = index + dir
    if (next < 0) return set({ focus: null, panelOpen: false })
    if (next >= ZONES.length) return
    set({ focus: ZONES[next].id, panelOpen: true, selectedProject: null })
  },
  setMode: (mode) => set({ mode, panelOpen: false, focus: null, nearby: null }),
  setReady: () => set({ ready: true }),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  toggleAmbience: () => set((s) => ({ ambience: !s.ambience })),
  wakePenny: () => set({ pennyAwake: Date.now() }),
  setNearby: (zone) => (get().nearby === zone ? undefined : set({ nearby: zone })),
  selectProject: (slug) => set({ selectedProject: slug }),
}))

/** Values that change every frame live outside React state to avoid re-renders. */
export const live = {
  mascot: { x: 2.5, z: 10.5, heading: Math.PI, speed: 0 },
  joystick: { x: 0, y: 0 },
  keys: new Set<string>(),
  pointer: { x: 0, y: 0 },
}
