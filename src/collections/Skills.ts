import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const SKILL_GROUPS = [
  { label: 'Languages', value: 'languages' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'AI & Data', value: 'ai' },
  { label: 'Tools', value: 'tools' },
  { label: 'Soft skills', value: 'soft' },
]

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'level'],
    group: 'Work',
    description: 'Each skill is a toy block in the block tower.',
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'group', type: 'select', defaultValue: 'web', options: SKILL_GROUPS },
        {
          name: 'level',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 3,
          admin: { description: '1 = learning, 5 = super comfy' },
        },
      ],
    },
    orderField,
  ],
}
