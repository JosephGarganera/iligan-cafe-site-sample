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
      description:
        '📌 The master title displayed inside the browser tab and your main header navbar.',
      placeholder: 'e.g., Chedings Copycat Cafe',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Hero Tagline Headline',
      type: 'string',
      group: 'branding',
      description:
        '📌 The large, vintage-inspired main headline centered right in the middle of your hero block.',
      placeholder: 'e.g., Brewing Community & Great Coffee in the heart of Iligan',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badgeText',
      title: 'Hero Badge Text Label',
      type: 'string',
      group: 'branding',
      description: '📌 The small capsule text chip floating directly above the main tagline.',
      placeholder: 'e.g., 📍 Near MSU-IIT Campus • Open Daily',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Paragraph Overview',
      type: 'text',
      group: 'branding',
      rows: 3,
      description:
        '📌 Optional: An editorial paragraph providing context or community vision right beneath your main tagline.',
      placeholder:
        'e.g., A cozy, high-speed sanctuary designed meticulously in Iligan City for digital builders, creators, and coffee purists.',
    }),
    defineField({
      name: 'seasonalTheme',
      title: 'Active Seasonal Engine Theme',
      type: 'string',
      group: 'seasonal',
      description:
        '⚙️ Instantly changes the webpage background palettes, text tones, and product card moods site-wide.',
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
      description:
        '⚙️ Controls the styling depth and floating box-shadow parameters applied to product containers.',
      options: {
        list: [
          {title: 'Flat (No Shadows - Minimalist)', value: 'shadow-none'},
          {title: 'Subtle Accent Lift (Clean)', value: 'shadow-xs'},
          {title: 'Modern Soft Depth (Elegant)', value: 'shadow-md'},
          {title: 'Heavy Editorial Pop (The Tavern Style)', value: 'shadow-xl'},
        ],
      },
      initialValue: 'shadow-xl',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Component Border Corners Sharpness',
      type: 'string',
      group: 'accents',
      description:
        '⚙️ Adjusts the curvature radius theme of image boxes, modals, buttons, and product cards site-wide.',
      options: {
        list: [
          {title: 'Sharp (Classic Editorial Grid)', value: 'rounded-none'},
          {title: 'Soft Rounded (Modern Tech Fluid)', value: 'rounded-xl'},
          {title: 'Pill Rounded (Highly Organic Playground)', value: 'rounded-3xl'},
        ],
      },
      initialValue: 'rounded-3xl',
    }),
  ],
})
