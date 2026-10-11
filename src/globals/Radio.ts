import type { GlobalConfig } from 'payload'
import { anyone } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Radio: GlobalConfig = {
  slug: 'radio',
  label: 'Island radio',
  admin: {
    group: 'Settings',
    description:
      'Background music that starts when a visitor taps the 🔈 sound button. Use an official YouTube video (licensed playback) or upload an audio file you have the rights to.',
  },
  access: { read: anyone },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'title', type: 'text', defaultValue: 'Dard-e-Disco · Om Shanti Om' },
    {
      name: 'youtubeUrl',
      type: 'text',
      defaultValue: 'https://www.youtube.com/watch?v=cKs83ZQxYKA',
      admin: { description: 'Link to the official video. Plays in a small radio player on the island.' },
    },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. If set, this file plays instead of the YouTube video.' },
    },
    {
      name: 'volume',
      type: 'number',
      min: 1,
      max: 100,
      defaultValue: 15,
      admin: { description: '1–100. Keep it low and relaxing.' },
    },
    {
      name: 'waves',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Soft ocean-wave ambience under the music.' },
    },
  ],
}
