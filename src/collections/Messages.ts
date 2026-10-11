import type { CollectionConfig } from 'payload'
import { loggedIn } from '../access'

// Contact form submissions. Only the site server writes here (via the local API),
// so public create access stays closed.
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Inbox' },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'createdAt', 'read'],
    group: 'Inbox',
    description: 'Notes visitors posted in the mailbox on the island.',
  },
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'read', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
