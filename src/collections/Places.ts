import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Places: CollectionConfig = {
  slug: 'places',
  labels: { singular: 'Place', plural: 'Travel map' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'status'],
    group: 'Life',
    description:
      'Pins on the globe at the Travel Dock. Add latitude/longitude (right-click a spot in Google Maps to copy them).',
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'Bangladesh' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'visited',
          options: [
            { label: 'Been there', value: 'visited' },
            { label: 'Bucket list', value: 'bucket' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', admin: { step: 0.0001 } },
        { name: 'lng', type: 'number', admin: { step: 0.0001 } },
        { name: 'when', type: 'text', admin: { description: 'e.g. "Winter 2025"' } },
      ],
    },
    { name: 'story', type: 'textarea' },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
    visibleField,
    orderField,
  ],
}
