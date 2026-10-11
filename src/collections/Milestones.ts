import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

// Extra moments for the Memory Lane timeline. Education, jobs, projects, awards and papers
// are added to the timeline automatically from their own dates; use this for everything else.
export const Milestones: CollectionConfig = {
  slug: 'milestones',
  labels: { singular: 'Milestone', plural: 'Life milestones' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'emoji'],
    group: 'Life',
    description:
      'Extra moments for the timeline (trips, firsts, big days). Jobs, projects, awards, papers and school already appear there automatically.',
  },
  access: { read: anyone },
  defaultSort: 'date',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'emoji', type: 'text', defaultValue: '✨', admin: { width: '20%' } },
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
        },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'link', type: 'text' },
    visibleField,
  ],
}
