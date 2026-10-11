import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { slugField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Story', plural: 'Blog stories' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    group: 'Life',
    description: 'Adventure stories for the Story Cabin. Save as draft until you are ready to publish.',
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short teaser for the story card.' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Travel', value: 'travel' },
        { label: 'Food', value: 'food' },
        { label: 'Tech', value: 'tech' },
        { label: 'Fashion', value: 'fashion' },
        { label: 'Life', value: 'life' },
        { label: 'Penny', value: 'penny' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date() : value)],
      },
    },
    slugField('title'),
  ],
}
