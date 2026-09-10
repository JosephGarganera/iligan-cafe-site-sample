import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Global Website Customizer',
  type: 'document',
  groups: [
    {name: 'branding', title: 'Branding & Copy'},
    {name: 'seasonal', title: 'Seasonal Themes'},
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
      initialValue: 'Brewing Community & Great Coffee in the heart of Iligan',
    }),
    defineField({
      name: 'badgeText',
      title: 'Hero Badge Text Label',
      type: 'string',
      group: 'branding',
      initialValue: 'Proudly Serving Iligan City',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Paragraph Overview',
      type: 'text',
      group: 'branding',
      rows: 3,
    }),

    // NEW SEASONAL THEME MATRIX
    defineField({
      name: 'seasonalTheme',
      title: 'Active Seasonal Engine Theme',
      type: 'string',
      group: 'seasonal',
      description:
        'Changes the background colors, text tones, and modal fields site-wide instantly.',
      options: {
        list: [
          {title: '☀️ Summer Sunshine (Warm Amber & Vanilla Creams)', value: 'summer'},
          {title: '🌧️ Rainy Day Comfort (Cozy Rich Stones & Deep Slate)', value: 'rainy'},
          {
            title: '🌹 Diyandi Festival Viva! (Vibrant Crimson Red & Gold Accents)',
            value: 'diyandi',
          },
          {title: '🎄 Holiday Evergreen (Festive Pine Greens & Crimson Cocoa)', value: 'holiday'},
        ],
        layout: 'radio',
      },
      initialValue: 'summer',
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
      initialValue: 'shadow-xl',
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
      initialValue: 'rounded-3xl',
    }),
  ],
})
