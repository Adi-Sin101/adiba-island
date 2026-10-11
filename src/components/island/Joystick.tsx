'use client'

import { useRef, useState } from 'react'

import { live } from './store'

/** On-screen thumbstick for touch devices in play mode. */
export function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const active = useRef<number | null>(null)

  function move(e: React.PointerEvent) {
    if (active.current !== e.pointerId || !base.current) return
    const rect = base.current.getBoundingClientRect()
    const r = rect.width / 2
    let x = (e.clientX - rect.left - r) / r
    let y = (e.clientY - rect.top - r) / r
    const len = Math.hypot(x, y)
    if (len > 1) {
      x /= len
      y /= len
    }
    live.joystick.x = x
    live.joystick.y = -y
    setKnob({ x: x * r * 0.6, y: y * r * 0.6 })
  }

  function end() {
    active.current = null
    live.joystick.x = live.joystick.y = 0
    setKnob({ x: 0, y: 0 })
  }

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(e) => {
        active.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e)
      }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-hidden
    >
      <span style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
