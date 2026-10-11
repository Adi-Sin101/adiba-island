import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { orderField, slugField, visibleField } from '../fields/slug'
import { revalidateHooks } from '../hooks/revalidate'

export const PROJECT_CATEGORIES = [
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'AI / ML', value: 'ai' },
  { label: 'Systems & Languages', value: 'systems' },
  { label: 'Graphics & Games', value: 'graphics' },
  { label: 'Research', value: 'research' },
  { label: 'Other', value: 'other' },
]

export const TOY_TYPES = [
  { label: 'Rocket', value: 'rocket' },
  { label: 'Robot', value: 'robot' },
  { label: 'Toy car', value: 'car' },
  { label: 'Teddy bear', value: 'teddy' },
  { label: 'Rubber duck', value: 'duck' },
  { label: 'Spinning top', value: 'top' },
  { label: 'Gift box', value: 'gift' },
  { label: 'Building blocks', value: 'blocks' },
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'visible', 'order'],
    group: 'Work',
    description:
      'Each project becomes a toy on the Workshop shelves. Use "Sync GitHub" to pull in new repos (they arrive hidden so you can review them first).',
    components: { beforeList: ['@/components/admin/SyncGithubButton#SyncGithubButton'] },
  },
  access: { read: anyone },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'tagline', type: 'text', admin: { description: 'One fun line shown on the toy tag.' } },
    { name: 'description', type: 'textarea' },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'select', options: PROJECT_CATEGORIES, defaultValue: 'web' },
        {
          name: 'toy',
          type: 'select',
          options: TOY_TYPES,
          defaultValue: 'blocks',
          admin: { description: 'Which toy represents it in 3D.' },
        },
        { name: 'year', type: 'text' },
      ],
    },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'e.g. "Full-stack lead" or "Team project at Logarithm Studio".' },
    },
    {
      name: 'tech',
      type: 'array',
      labels: { singular: 'Technology', plural: 'Tech stack' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'repo', type: 'text' },
            { name: 'live', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'paper', type: 'text' },
            { name: 'video', type: 'text' },
          ],
        },
        { name: 'store', type: 'text', admin: { description: 'App Store / Play Store link' } },
      ],
    },
    {
      name: 'github',
      type: 'group',
      admin: { description: 'Filled automatically by "Sync GitHub".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'fullName', type: 'text', index: true },
            { name: 'private', type: 'checkbox' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'stars', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'pushedAt', type: 'date' },
          ],
        },
        { name: 'languages', type: 'json' },
      ],
    },
    { name: 'date', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' }, description: 'When it started (puts it on the timeline).' } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'showRepoLink',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick for private repos you do not want linked.' },
    },
    visibleField,
    orderField,
    slugField('title'),
  ],
}
