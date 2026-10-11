'use client'

// Tiny synthesised "pop" and "boop" sounds, so the site ships no audio files.
let ctx: AudioContext | null = null

function audio() {
  if (typeof window === 'undefined') return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function playPop(freq = 520) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ac.currentTime + 0.08)
  gain.gain.setValueAtTime(0.18, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + 0.2)
}

export function playWhoosh() {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(300, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(900, ac.currentTime + 0.25)
  gain.gain.setValueAtTime(0.06, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + 0.32)
}

// Soft ocean ambience: filtered noise whose loudness rises and falls like waves.
let waves: { stop: () => void } | null = null

export function startWaves(volume = 0.05) {
  const ac = audio()
  if (!ac || waves) return
  const length = ac.sampleRate * 4
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    // brown noise: smoother and deeper than white noise
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  const source = ac.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 650
  const gain = ac.createGain()
  gain.gain.value = 0
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + 2)
  // slow swell, roughly one wave every 7 seconds
  const lfo = ac.createOscillator()
  lfo.frequency.value = 0.14
  const lfoDepth = ac.createGain()
  lfoDepth.gain.value = volume * 0.6
  lfo.connect(lfoDepth).connect(gain.gain)
  source.connect(filter).connect(gain).connect(ac.destination)
  source.start()
  lfo.start()
  waves = {
    stop: () => {
      gain.gain.cancelScheduledValues(ac.currentTime)
      gain.gain.setValueAtTime(gain.gain.value, ac.currentTime)
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8)
      source.stop(ac.currentTime + 0.9)
      lfo.stop(ac.currentTime + 0.9)
    },
  }
}

export function stopWaves() {
  waves?.stop()
  waves = null
}
