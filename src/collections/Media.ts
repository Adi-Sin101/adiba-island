import type { CollectionConfig } from 'payload'
import { anyone } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Settings', description: 'Every photo and file used on the site.' },
  access: { read: anyone },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Short description for screen readers.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'video/webm', 'audio/*'],
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumb',
        width: 480,
        height: 480,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'large', width: 1800, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
  },
}
