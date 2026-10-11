import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, slugField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'venue', 'year', 'status'],
    group: 'Work',
    description: 'Papers shown in the Research Lighthouse.',
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'authors',
      type: 'text',
      admin: { description: 'Comma separated. Your name gets highlighted automatically.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'venue', type: 'text' },
        { name: 'year', type: 'text' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'published',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Under review', value: 'review' },
            { label: 'Preprint', value: 'preprint' },
            { label: 'In progress', value: 'progress' },
          ],
        },
      ],
    },
    { name: 'abstract', type: 'textarea' },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'paper', type: 'text' },
            { name: 'scholar', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'code', type: 'text' },
            { name: 'demo', type: 'text' },
          ],
        },
      ],
    },
    { name: 'citations', type: 'number' },
    { name: 'date', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' }, description: 'Submission or publication month (timeline).' } },
    visibleField,
    orderField,
    slugField('title'),
  ],
}
