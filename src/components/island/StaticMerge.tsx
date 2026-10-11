'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** Put on any object (and its subtree) that animates, so StaticMerge leaves it alone. */
export const DYNAMIC = { dynamic: true } as const

const noRaycast = () => {}

/**
 * Bakes every non-animated mesh below it into one mesh per material.
 * The island is built from hundreds of tiny primitives; merging them turns
 * ~1000 draw calls into a few hundred, which keeps phones smooth.
 * Children marked with `userData={DYNAMIC}` keep their own transforms.
 */
export function StaticMerge({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const group = root.current
    if (!group) return
    group.updateWorldMatrix(true, true)
    const toLocal = new THREE.Matrix4().copy(group.matrixWorld).invert()

    type Bucket = { material: THREE.Material; geometries: THREE.BufferGeometry[]; meshes: THREE.Mesh[]; cast: boolean; receive: boolean }
    const buckets = new Map<string, Bucket>()

    const visit = (obj: THREE.Object3D) => {
      if (obj.userData.dynamic) return
      if ((obj as THREE.Mesh).isMesh && !(obj as THREE.InstancedMesh).isInstancedMesh) {
        const mesh = obj as THREE.Mesh
        const material = mesh.material
        const hasOutline = mesh.children.some((c) => (c as THREE.Mesh).isMesh)
        if (!Array.isArray(material) && !hasOutline && mesh.visible && !(material as THREE.Material).transparent) {
          const source = mesh.geometry
          const geometry = new THREE.BufferGeometry()
          for (const name of ['position', 'normal', 'uv'] as const) {
            const attr = source.getAttribute(name)
            if (attr) geometry.setAttribute(name, attr.clone())
          }
          if (source.index) geometry.setIndex(source.index.clone())
          if (geometry.getAttribute('position') && geometry.getAttribute('normal') && geometry.getAttribute('uv')) {
            geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toLocal, mesh.matrixWorld))
            const key = `${material.uuid}|${geometry.index ? 'i' : 'n'}|${mesh.castShadow}|${mesh.receiveShadow}`
            let bucket = buckets.get(key)
            if (!bucket) {
              bucket = { material, geometries: [], meshes: [], cast: mesh.castShadow, receive: mesh.receiveShadow }
              buckets.set(key, bucket)
            }
            bucket.geometries.push(geometry)
            bucket.meshes.push(mesh)
          }
        }
      }
      for (const child of obj.children) visit(child)
    }
    for (const child of group.children) visit(child)

    const merged: THREE.Mesh[] = []
    const hidden: THREE.Mesh[] = []
    for (const bucket of buckets.values()) {
      if (bucket.geometries.length < 2) {
        bucket.geometries.forEach((g) => g.dispose())
        continue
      }
      const geometry = mergeGeometries(bucket.geometries, false)
      bucket.geometries.forEach((g) => g.dispose())
      if (!geometry) continue
      const mesh = new THREE.Mesh(geometry, bucket.material)
      mesh.castShadow = bucket.cast
      mesh.receiveShadow = bucket.receive
      mesh.userData.merged = true
      group.add(mesh)
      merged.push(mesh)
      hidden.push(...bucket.meshes)
    }

    // Hide the originals that went into a merged mesh.
    for (const mesh of hidden) {
      mesh.visible = false
      mesh.raycast = noRaycast
    }

    return () => {
      for (const mesh of merged) {
        group.remove(mesh)
        mesh.geometry.dispose()
      }
      for (const mesh of hidden) {
        mesh.visible = true
        mesh.raycast = THREE.Mesh.prototype.raycast
      }
    }
  }, [])

  return <group ref={root}>{children}</group>
}
