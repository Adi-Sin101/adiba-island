import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'event', 'year'], group: 'Work' },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'event', type: 'text' },
        { name: 'year', type: 'text' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'date', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' }, description: 'Puts it on the timeline.' } },
    {
      name: 'medal',
      type: 'select',
      defaultValue: 'star',
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
        { label: 'Star', value: 'star' },
      ],
    },
    visibleField,
    orderField,
  ],
}
