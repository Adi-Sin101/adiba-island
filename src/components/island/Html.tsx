'use client'

import { Html as DreiHtml } from '@react-three/drei'
import { createRef, type ComponentProps } from 'react'

/**
 * Stable DOM layer for every 3D label. Without a fixed portal, drei re-parents its
 * overlays once R3F connects pointer events, and some labels get lost in the remount.
 */
export const htmlLayer = createRef<HTMLDivElement>()

export function Html(props: ComponentProps<typeof DreiHtml>) {
  return <DreiHtml portal={htmlLayer as React.RefObject<HTMLElement>} {...props} />
}
