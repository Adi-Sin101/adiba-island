import type { GlobalConfig } from 'payload'
import { anyone } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'My Profile',
  admin: { group: 'Settings', description: 'Your name, intro, contact links and CV.' },
  access: { read: anyone },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Intro',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, defaultValue: 'Adiba Tahsin' },
                { name: 'nickname', type: 'text', defaultValue: 'A Diva' },
              ],
            },
            {
              name: 'roles',
              type: 'array',
              admin: { description: 'Rotating titles under your name on the welcome sign.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'greeting', type: 'text', defaultValue: 'Aloha!' },
            { name: 'headline', type: 'textarea', admin: { description: 'One or two lines on the welcome sign.' } },
            { name: 'bio', type: 'textarea', admin: { description: 'Longer "about me" text.' } },
            {
              name: 'funFacts',
              type: 'array',
              fields: [
                { name: 'emoji', type: 'text', admin: { width: '20%' } },
                { name: 'text', type: 'text', required: true },
              ],
            },
            { name: 'avatar', type: 'upload', relationTo: 'media' },
            { name: 'currentlyAt', type: 'text', admin: { description: 'e.g. "Software Engineer @ Logarithm Studio"' } },
            { name: 'location', type: 'text', defaultValue: 'Khulna, Bangladesh' },
            { name: 'tagline', type: 'text', admin: { description: 'Short professional line, e.g. your LinkedIn headline.' } },
            {
              name: 'openTo',
              type: 'text',
              admin: { description: 'e.g. "Internships, research collabs and hackathon teams"' },
            },
          ],
        },
        {
          label: 'Contact & socials',
          fields: [
            { name: 'email', type: 'email' },
            {
              name: 'socials',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'GitHub', value: 'github' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Google Scholar', value: 'scholar' },
                        { label: 'X / Twitter', value: 'x' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'Website', value: 'website' },
                      ],
                    },
                    { name: 'url', type: 'text', required: true },
                    { name: 'handle', type: 'text' },
                  ],
                },
              ],
            },
            { name: 'cv', type: 'upload', relationTo: 'media', admin: { description: 'PDF shown on the "Download CV" button.' } },
          ],
        },
        {
          label: 'Education',
          fields: [
            {
              name: 'education',
              type: 'array',
              fields: [
                { name: 'degree', type: 'text', required: true },
                { name: 'school', type: 'text', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'period', type: 'text' },
                    { name: 'grade', type: 'text' },
                    { name: 'startDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
