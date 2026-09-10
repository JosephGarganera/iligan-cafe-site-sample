import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item or Product',
  type: 'document',

  // Organizing structural data into professional administrative tabs
  groups: [
    {name: 'details', title: 'Product Details'},
    {name: 'media', title: 'Media Assets'},
    {name: 'status', title: 'Inventory & Sorting'},
  ],

  fields: [
    defineField({
      name: 'name',
      title: 'Item Name',
      type: 'string',
      group: 'details',
      description: 'The display title of your dish or drink (e.g., Iligan Cold Brew Latte).',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(100)
          .warning('Keep names clean and short for mobile optimization.'),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'details',
      description: 'Unique URL identifier. Click "Generate" based on the product name.',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Price (PHP)',
      type: 'number',
      group: 'details',
      description: 'Item price in Philippine Pesos.',
      validation: (Rule) => Rule.required().min(0).error('Price cannot be a negative value!'),
    }),

    defineField({
      name: 'description',
      title: 'Description or Ingredients',
      type: 'text',
      group: 'details',
      rows: 3,
      description: 'A brief, appetizing overview of the menu item components.',
      validation: (Rule) =>
        Rule.required()
          .max(300)
          .error('Descriptions must stay under 300 characters to protect card dimensions.'),
    }),

    defineField({
      name: 'category',
      title: 'Menu Category',
      type: 'string',
      group: 'status',
      options: {
        list: [
          {title: 'Espresso & Coffee Coffee', value: 'coffee'},
          {title: 'Non-Caffeinated Drinks', value: 'non-coffee'},
          {title: 'Pastries & Breads', value: 'pastries'},
          {title: 'All-Day Breakfast / Meals', value: 'meals'},
        ],
        layout: 'radio', // Renders clean selection radio bullets instead of a boring raw text box
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      group: 'media',
      description: 'Upload high-resolution compressed images (WebP format recommended).',
      options: {
        hotspot: true, // Enables responsive focal points for safe image crops on phones
        storeOriginalFilename: false,
      },
      validation: (Rule) =>
        Rule.required().error(
          'Every enterprise item must contain an image to pass frontend verification.',
        ),
    }),

    defineField({
      name: 'isAvailable',
      title: 'Currently in Stock?',
      type: 'boolean',
      group: 'status',
      description:
        'Toggling this off instantly pulls the item from the live Vercel menu without deleting data.',
      initialValue: true,
    }),

    defineField({
      name: 'orderPriority',
      title: 'Sorting Priority Order',
      type: 'number',
      group: 'status',
      description: 'Higher numbers appear first on the menu layout grid (e.g., 100 before 1).',
      initialValue: 0,
    }),
  ],

  // Visual Studio Studio Custom Preview (Makes items searchable and visibly stunning inside the dashboard list views)
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'image',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle ? `₱${subtitle} PHP` : 'No Price Configured',
        media: media,
      }
    },
  },
})
