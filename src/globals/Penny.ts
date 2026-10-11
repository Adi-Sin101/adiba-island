import type { GlobalConfig } from 'payload'
import { anyone } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Penny: GlobalConfig = {
  slug: 'penny',
  label: 'Penny the cat',
  admin: { group: 'Life', description: 'Penny naps in the hammock. Clicking her opens this album.' },
  access: { read: anyone },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'intro', type: 'textarea' },
    {
      name: 'facts',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'meows',
      type: 'array',
      admin: { description: 'Random speech bubbles when someone wakes her up.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}
