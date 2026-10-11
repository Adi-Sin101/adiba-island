import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'organization', 'kind', 'period'],
    group: 'Work',
    description: 'Jobs, leadership, research, volunteering and education. Shown on the Events Stage.',
  },
  access: { read: anyone },
  defaultSort: '-startDate',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true },
        { name: 'organization', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'work',
          options: [
            { label: 'Work', value: 'work' },
            { label: 'Leadership', value: 'leadership' },
            { label: 'Research', value: 'research' },
            { label: 'Volunteer', value: 'volunteer' },
            { label: 'Education', value: 'education' },
          ],
        },
        { name: 'period', type: 'text', admin: { description: 'e.g. "2024 – Present"' } },
        { name: 'location', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' }, description: 'Used to sort the timeline.' } },
        { name: 'endDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' }, description: 'Leave empty if ongoing.' } },
      ],
    },
    { name: 'summary', type: 'textarea' },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'url', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    visibleField,
    orderField,
  ],
}
