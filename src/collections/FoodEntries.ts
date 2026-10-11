import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const FoodEntries: CollectionConfig = {
  slug: 'food',
  labels: { singular: 'Food entry', plural: 'Food diary' },
  admin: {
    useAsTitle: 'dish',
    defaultColumns: ['dish', 'place', 'status', 'rating'],
    group: 'Life',
    description: 'Dishes you tried (or want to try). Served at the Seafood Shack.',
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'dish', type: 'text', required: true },
        { name: 'place', type: 'text', admin: { description: 'Restaurant or stall' } },
        { name: 'city', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'tried',
          options: [
            { label: 'Tried it', value: 'tried' },
            { label: 'Want to try', value: 'wishlist' },
          ],
        },
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'seafood',
          options: [
            { label: 'Seafood', value: 'seafood' },
            { label: 'Street food', value: 'street' },
            { label: 'Dessert', value: 'dessert' },
            { label: 'Drinks', value: 'drinks' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'rating', type: 'number', min: 1, max: 5, admin: { description: '1–5 shells' } },
        { name: 'date', type: 'date' },
      ],
    },
    { name: 'notes', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    visibleField,
    orderField,
  ],
}
