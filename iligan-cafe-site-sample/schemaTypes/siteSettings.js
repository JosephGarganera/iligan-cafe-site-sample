import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Global Website Customizer',
  type: 'document',
  groups: [
    {name: 'branding', title: 'Branding & Copy'},
    {name: 'theme', title: 'Colors & Mode'},
    {name: 'accents', title: 'Borders & Shadows'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Cafe/Store Name',
      type: 'string',
      group: 'branding',
      initialValue: 'Chedings Copycat Cafe',
    }),
    defineField({
      name: 'tagline',
      title: 'Hero Tagline Headline',
      type: 'string',
      group: 'branding',
      initialValue: 'Locally sourced treats. Crafted for digital builders.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Paragraph Overview',
      type: 'text',
      group: 'branding',
      rows: 3,
    }),
    defineField({
      name: 'modeSelection',
      title: 'Active Interface Theme Mode',
      type: 'string',
      group: 'theme',
      options: {
        list: [
          {title: '☀️ Strict Light Mode', value: 'light'},
          {title: '🌙 Strict Dark Mode', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'accentColor',
      title: 'Primary Brand Color Theme',
      type: 'string',
      group: 'theme',
      options: {
        list: [
          {title: '🍂 Amber Cream (Warm)', value: 'amber'},
          {title: '🪵 Espresso Espresso (Chic Dark)', value: 'stone'},
          {title: '🌹 Classic Ruby Red (Bold)', value: 'red'},
          {title: '🫐 Midnight Indigo (Tech Clean)', value: 'indigo'},
        ],
        layout: 'radio',
      },
      initialValue: 'amber',
    }),
    defineField({
      name: 'shadowIntensity',
      title: 'Card Box Shadows Depth',
      type: 'string',
      group: 'accents',
      options: {
        list: [
          {title: 'Flat (No Shadows)', value: 'shadow-none'},
          {title: 'Subtle Accent Lift', value: 'shadow-xs'},
          {title: 'Modern Soft Depth', value: 'shadow-md'},
          {title: 'Heavy Editorial Pop', value: 'shadow-xl'},
        ],
      },
      initialValue: 'shadow-md',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Component Border Corners Sharpness',
      type: 'string',
      group: 'accents',
      options: {
        list: [
          {title: 'Sharp (Minimalist Grid)', value: 'rounded-none'},
          {title: 'Soft Rounded (Clean Modern)', value: 'rounded-xl'},
          {title: 'Pill Rounded (Fluid Playground)', value: 'rounded-3xl'},
        ],
      },
      initialValue: 'rounded-xl',
    }),
    defineField({
      name: 'badgeText',
      title: 'Hero Badge Text Label',
      type: 'string',
      group: 'branding',
      description:
        'The small capsule text above the main headline (e.g., Proudly Serving Iligan City).',
      initialValue: 'Proudly Serving Iligan City',
    }),
  ],
})
