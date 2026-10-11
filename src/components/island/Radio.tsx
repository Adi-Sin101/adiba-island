'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import type { RadioData } from '@/lib/types'
import { startWaves, stopWaves } from './sound'
import { useIsland } from './store'

type YTPlayer = { setVolume: (v: number) => void; playVideo: () => void; pauseVideo: () => void; destroy: () => void }
type YTNamespace = { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer }

let apiPromise: Promise<YTNamespace> | null = null
function loadYouTube() {
  apiPromise ??= new Promise((resolve) => {
    const w = window as unknown as { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void }
    if (w.YT?.Player) return resolve(w.YT)
    w.onYouTubeIframeAPIReady = () => resolve(w.YT!)
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return apiPromise
}

/**
 * Island radio: when the visitor turns sound on, soft waves start and the chosen song plays
 * quietly. YouTube songs play through the official embedded player (shown as a little toy
 * radio, as YouTube requires the player to stay visible); uploaded files use <audio>.
 */
export function Radio({ radio }: { radio: RadioData }) {
  const sound = useIsland((s) => s.sound)
  const toggleSound = useIsland((s) => s.toggleSound)
  const mount = useRef<HTMLDivElement>(null)
  const audioEl = useRef<HTMLAudioElement>(null)
  const playing = sound && radio.enabled
  const useYouTube = playing && !radio.audioUrl && Boolean(radio.youtubeId)

  useEffect(() => {
    if (!sound || !radio.waves) return
    startWaves(0.045)
    return () => stopWaves()
  }, [sound, radio.waves])

  useEffect(() => {
    const el = audioEl.current
    if (!el) return
    if (playing && radio.audioUrl) {
      el.volume = radio.volume / 100
      void el.play().catch(() => {})
    } else el.pause()
  }, [playing, radio.audioUrl, radio.volume])

  useEffect(() => {
    if (!useYouTube || !mount.current) return
    let player: YTPlayer | null = null
    let cancelled = false
    const target = document.createElement('div')
    mount.current.appendChild(target)
    void loadYouTube().then((YT) => {
      if (cancelled) return
      player = new YT.Player(target, {
        width: 200,
        height: 200,
        videoId: radio.youtubeId,
        playerVars: { autoplay: 1, loop: 1, playlist: radio.youtubeId, controls: 1, rel: 0, playsinline: 1, modestbranding: 1 },
        events: {
          onReady: () => {
            player?.setVolume(radio.volume)
            player?.playVideo()
          },
        },
      })
    })
    return () => {
      cancelled = true
      player?.destroy()
      target.remove()
    }
  }, [useYouTube, radio.youtubeId, radio.volume])

  return (
    <>
      {radio.audioUrl && <audio ref={audioEl} src={radio.audioUrl} loop preload="none" />}
      <AnimatePresence>
        {useYouTube && (
          <motion.aside
            className="radio"
            initial={{ opacity: 0, y: 30, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 30 }}
            aria-label="Island radio"
          >
            <div className="radio__top">
              <span className="radio__dial" aria-hidden />
              <p className="radio__title" title={radio.title}>
                📻 {radio.title || 'Island radio'}
              </p>
              <button type="button" className="radio__btn" onClick={toggleSound} aria-label="Turn sound off">
                ✕
              </button>
            </div>
            <div ref={mount} className="radio__screen" />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
