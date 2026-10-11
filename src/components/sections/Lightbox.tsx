'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

import type { Img } from '@/lib/types'
import { Photo } from './ui'

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
  captions,
}: {
  images: Img[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
  captions?: string[]
}) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [index, images.length, onClose, onIndex])

  return (
    <AnimatePresence>
      {index !== null && images[index] && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <motion.figure
            key={index}
            className="polaroid max-h-full max-w-[min(92vw,720px)]"
            initial={{ scale: 0.85, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[72vh] overflow-hidden rounded-xl">
              <Photo img={images[index]} variant="large" sizes="92vw" className="!h-auto max-h-[72vh] !object-contain" />
            </div>
            {captions?.[index] && <figcaption className="mt-3 text-center font-display text-lg text-ink">{captions[index]}</figcaption>}
          </motion.figure>
          {images.length > 1 && (
            <>
              <button type="button" className="lightbox-nav left-3" aria-label="Previous photo" onClick={(e) => (e.stopPropagation(), onIndex((index - 1 + images.length) % images.length))}>
                ‹
              </button>
              <button type="button" className="lightbox-nav right-3" aria-label="Next photo" onClick={(e) => (e.stopPropagation(), onIndex((index + 1) % images.length))}>
                ›
              </button>
            </>
          )}
          <button type="button" className="lightbox-nav right-3 top-3 !translate-y-0" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
