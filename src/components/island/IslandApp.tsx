'use client'

import { AnimatePresence, motion } from 'motion/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ZoneContent } from '@/components/sections/ZoneContent'
import type { SiteContent } from '@/lib/types'
import { htmlLayer } from './Html'
import { Joystick } from './Joystick'
import { Loader } from './Loader'
import { Radio } from './Radio'
import { live, useIsland } from './store'
import { ZONES, zoneById } from './zones'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/* ----------------------------------------------------------------- panel */

function Panel({ content }: { content: SiteContent }) {
  const { focus, panelOpen, close, step, selectedProject, selectProject, open } = useIsland()
  const zone = focus ? zoneById(focus) : null
  const index = focus ? ZONES.findIndex((z) => z.id === focus) : -1
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [focus, selectedProject])

  return (
    <AnimatePresence>
      {panelOpen && zone && (
        <motion.aside
          key="panel"
          className="panel"
          initial={{ opacity: 0, x: 60, y: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          aria-label={zone.title}
          role="dialog"
          data-lenis-prevent
        >
          <div className="panel__bar" style={{ ['--zone' as string]: zone.color }}>
            <span className="panel__badge">
              <span aria-hidden>{zone.emoji}</span> {zone.label}
            </span>
            <button type="button" className="icon-btn" onClick={close} aria-label="Close panel">
              ✕
            </button>
          </div>
          <div ref={scroller} className="panel__body">
            <AnimatePresence mode="wait">
              <motion.div key={focus} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <ZoneContent zone={zone.id} content={content} selectedProject={selectedProject} onSelectProject={selectProject} onContact={() => open('mailbox')} onProject={(slug) => open('workshop', { project: slug })} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="panel__foot">
            <button type="button" className="chip" onClick={() => step(-1)} disabled={index <= 0}>
              ← {index > 0 ? ZONES[index - 1].blurb : 'Start'}
            </button>
            <span className="text-xs font-bold text-ink/50">
              {index + 1} / {ZONES.length}
            </span>
            <button type="button" className="chip" onClick={() => step(1)} disabled={index >= ZONES.length - 1}>
              {index < ZONES.length - 1 ? ZONES[index + 1].blurb : 'The end'} →
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------- HUD */

function Hud({ name }: { name: string }) {
  const { focus, mode, setMode, overview, open, sound, toggleSound, ambience, toggleAmbience, nearby, panelOpen, step } = useIsland()
  const [menu, setMenu] = useState(false)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 9000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <header className="hud-top">
        <button type="button" className="brand" onClick={overview} aria-label="Show the whole island">
          <span className="brand__dot" aria-hidden>
            🏝️
          </span>
          <span>
            <strong>{name.split(' ')[0]}</strong>
            <small>A&nbsp;Diva&apos;s island</small>
          </span>
        </button>
        <nav className="flex items-center gap-2" aria-label="Island controls">
          <button type="button" className={`hud-btn ${mode === 'play' ? 'hud-btn--on' : ''}`} onClick={() => setMode(mode === 'play' ? 'tour' : 'play')} aria-pressed={mode === 'play'}>
            <span aria-hidden>🎮</span>
            <span className="hidden sm:inline">{mode === 'play' ? 'Exit play' : 'Play mode'}</span>
          </button>
          <button type="button" className={`hud-btn ${sound ? 'hud-btn--on' : 'hud-btn--nudge'}`} onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn music off' : 'Turn music on'}>
            <span aria-hidden>🎵</span>
            <span className="hidden lg:inline">{sound ? 'Music on' : 'Music'}</span>
          </button>
          <button type="button" className={`hud-btn ${ambience ? 'hud-btn--on' : ''}`} onClick={toggleAmbience} aria-pressed={ambience} aria-label={ambience ? 'Turn beach sounds off' : 'Turn beach sounds on'} title="Beach sounds">
            <span aria-hidden>🌊</span>
            <span className="hidden lg:inline">Waves</span>
          </button>
          <Link href="/classic" className="hud-btn" prefetch={false}>
            <span aria-hidden>📜</span>
            <span className="hidden sm:inline">Classic view</span>
          </Link>
          <button type="button" className="hud-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Open the island map">
            <span aria-hidden>🗺️</span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.nav
            className="map-menu"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            aria-label="Island map"
          >
            <p className="mb-2 font-display text-lg text-ink">Island map</p>
            <ul className="grid grid-cols-2 gap-2">
              {ZONES.map((z) => (
                <li key={z.id}>
                  <button
                    type="button"
                    className="map-menu__item"
                    style={{ ['--tag' as string]: z.color }}
                    onClick={() => {
                      setMenu(false)
                      if (mode === 'play') setMode('tour')
                      open(z.id)
                    }}
                  >
                    <span aria-hidden>{z.emoji}</span>
                    <span>
                      <strong>{z.blurb}</strong>
                      <small>{z.label}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* bottom dock: quick zone hopping */}
      {mode === 'tour' && !panelOpen && (
        <nav className="dock" aria-label="Sections">
          <button type="button" className="dock__arrow" onClick={() => step(-1)} aria-label="Previous section">
            ‹
          </button>
          <ul className="dock__list">
            {ZONES.map((z) => (
              <li key={z.id}>
                <button type="button" className={`dock__item ${focus === z.id ? 'dock__item--on' : ''}`} onClick={() => open(z.id)} title={z.label} style={{ ['--tag' as string]: z.color }}>
                  <span aria-hidden>{z.emoji}</span>
                  <small>{z.blurb}</small>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="dock__arrow" onClick={() => step(1)} aria-label="Next section">
            ›
          </button>
        </nav>
      )}

      <AnimatePresence>
        {hint && mode === 'tour' && !panelOpen && (
          <motion.p className="hint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            Tap a spot to explore · drag to spin · <span className="hidden sm:inline">scroll</span><span className="sm:hidden">pinch</span> to zoom · <kbd>P</kbd> to play
          </motion.p>
        )}
      </AnimatePresence>

      {mode === 'play' && (
        <>
          <p className="hint">
            <span className="hidden sm:inline">
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd> to walk Boop around ·{' '}
            </span>
            walk up to a building and press <kbd>E</kbd>
          </p>
          <AnimatePresence>
            {nearby && !panelOpen && (
              <motion.button
                key={nearby}
                type="button"
                className="nearby"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={() => open(nearby)}
                style={{ ['--tag' as string]: zoneById(nearby).color }}
              >
                {zoneById(nearby).emoji} Enter {zoneById(nearby).label} <kbd>E</kbd>
              </motion.button>
            )}
          </AnimatePresence>
          <Joystick />
        </>
      )}
    </>
  )
}

/* ------------------------------------------------------------------- app */

export function IslandApp({ content }: { content: SiteContent }) {
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const ready = useIsland((s) => s.ready)

  useEffect(() => setWebgl(hasWebGL()), [])

  // keyboard: Esc closes, P toggles play, WASD walks, E enters
  useEffect(() => {
    const typing = (e: KeyboardEvent) => e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName)
    const down = (e: KeyboardEvent) => {
      if (typing(e)) return
      const key = e.key.toLowerCase()
      const s = useIsland.getState()
      if (key === 'escape') return s.panelOpen ? s.close() : s.overview()
      if (key === 'p') return s.setMode(s.mode === 'play' ? 'tour' : 'play')
      if (s.mode === 'play') {
        live.keys.add(key)
        if ((key === 'e' || key === 'enter') && s.nearby) s.open(s.nearby)
        if (key.startsWith('arrow')) e.preventDefault()
        return
      }
    }
    const up = (e: KeyboardEvent) => live.keys.delete(e.key.toLowerCase())
    const blur = () => live.keys.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [])

  if (webgl === false) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="toy-card max-w-md p-8">
          <p className="text-5xl">🏝️</p>
          <h1 className="mt-3 font-display text-3xl text-ink">The island needs WebGL</h1>
          <p className="mt-2 text-ink/70">Your browser can’t draw 3D right now, but the classic view has everything.</p>
          <Link href="/classic" className="toy-btn mt-5">
            Open the classic view
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="island-root">
      <div className="sky" aria-hidden />
      <div className="absolute inset-0">{webgl && <Scene content={content} />}</div>
      <div ref={htmlLayer} className="html-layer" />
      <Loader done={ready} />
      {ready && (
        <>
          <Hud name={content.profile.name} />
          <Radio radio={content.radio} />
          <Panel content={content} />
        </>
      )}
    </div>
  )
}
