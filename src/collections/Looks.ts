import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Looks: CollectionConfig = {
  slug: 'looks',
  labels: { singular: 'Look', plural: 'Lookbook' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'vibe', 'visible'],
    group: 'Life',
    description: 'Outfits for the Diva Boutique.',
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'photo', type: 'upload', relationTo: 'media', required: true },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'vibe',
          type: 'select',
          defaultValue: 'casual',
          options: [
            { label: 'Traditional', value: 'traditional' },
            { label: 'Party', value: 'party' },
            { label: 'Casual', value: 'casual' },
            { label: 'Adventure', value: 'adventure' },
            { label: 'Formal', value: 'formal' },
          ],
        },
      ],
    },
    { name: 'caption', type: 'textarea' },
    visibleField,
    orderField,
  ],
}
