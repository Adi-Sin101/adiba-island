import type { Field } from 'payload'

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** A unique slug that fills itself from another field when left empty. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `Used in links. Leave empty to generate from "${from}".`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})

/** Manual sort order shared by most collections. */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 100,
  admin: { position: 'sidebar', description: 'Smaller numbers show first.' },
}

export const visibleField: Field = {
  name: 'visible',
  type: 'checkbox',
  defaultValue: true,
  admin: { position: 'sidebar', description: 'Untick to hide from the public site.' },
}
