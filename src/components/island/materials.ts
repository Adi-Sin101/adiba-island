'use client'

import * as THREE from 'three'

// Three-step gradient gives every surface a soft cel-shaded "painted toy" look.
let gradient: THREE.DataTexture | null = null
function gradientMap() {
  if (gradient) return gradient
  const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255])
  gradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat)
  gradient.minFilter = THREE.NearestFilter
  gradient.magFilter = THREE.NearestFilter
  gradient.generateMipmaps = false
  gradient.needsUpdate = true
  return gradient
}

const cache = new Map<string, THREE.Material>()

/** Shared toon material per colour, so hundreds of meshes reuse a handful of materials. */
export function toon(color: string, opts: { emissive?: string; emissiveIntensity?: number } = {}) {
  const key = `${color}|${opts.emissive ?? ''}|${opts.emissiveIntensity ?? ''}`
  let mat = cache.get(key)
  if (!mat) {
    mat = new THREE.MeshToonMaterial({
      color,
      gradientMap: gradientMap(),
      emissive: opts.emissive ?? '#000000',
      emissiveIntensity: opts.emissiveIntensity ?? 1,
    })
    cache.set(key, mat)
  }
  return mat
}

/** Small canvas-drawn textures (gingham, stripes) keep the scene asset-free. */
export function patternTexture(kind: 'gingham' | 'stripes' | 'plaid', a: string, b: string, repeat = 4) {
  const key = `tex|${kind}|${a}|${b}|${repeat}`
  const hit = cache.get(key) as unknown as THREE.CanvasTexture | undefined
  if (hit) return hit
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = b
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = a
  if (kind === 'stripes') {
    ctx.fillRect(0, 0, size / 2, size)
  } else {
    ctx.globalAlpha = 0.55
    ctx.fillRect(0, 0, size / 2, size)
    ctx.fillRect(0, 0, size, size / 2)
    ctx.globalAlpha = 1
    ctx.fillRect(0, 0, size / 2, size / 2)
    if (kind === 'plaid') {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(size / 4, -2, 0.1, size + 4)
      ctx.strokeRect(-2, size / 4, size + 4, 0.1)
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat, repeat)
  tex.magFilter = THREE.NearestFilter
  tex.colorSpace = THREE.SRGBColorSpace
  cache.set(key, tex as unknown as THREE.Material)
  return tex
}

export function toonTextured(tex: THREE.Texture) {
  const key = `toontex|${tex.uuid}`
  let mat = cache.get(key)
  if (!mat) {
    mat = new THREE.MeshToonMaterial({ map: tex, gradientMap: gradientMap() })
    cache.set(key, mat)
  }
  return mat
}

export const PALETTE = {
  ink: '#1d1b3a',
  sand: '#ffe2a8',
  sandDark: '#f2c47e',
  grass: '#7fd36b',
  grassDark: '#58b54f',
  rock: '#b6a6c9',
  wood: '#c98a52',
  woodDark: '#9a6338',
  palmLeaf: '#3fbf6a',
  palmTrunk: '#b77b45',
  white: '#fffaf2',
  blue: '#2a6bf2',
  alienBlue: '#4c8dff',
  alienDark: '#2f5fd0',
  pink: '#ff7eb6',
  sun: '#ffd23f',
  coral: '#ff6f61',
  teal: '#2fc4c9',
  lilac: '#b79cff',
  skin: '#d9a07a',
  hair: '#2b1a14',
  ginger: '#f0a14a',
}
