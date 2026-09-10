import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item or Product',
  type: 'document',
  groups: [
    {name: 'details', title: 'Product Details'},
    {name: 'social', title: 'Social Proof & Rating'},
    {name: 'media', title: 'Media Assets'},
    {name: 'status', title: 'Inventory & Sorting'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Item Name',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (PHP)',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'caffeine',
      title: 'Caffeine Content (mg)',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description or Ingredients',
      type: 'text',
      group: 'details',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Menu Category',
      type: 'string',
      group: 'status',
      options: {
        list: [
          {title: '☕ Espresso & Coffee', value: 'coffee'},
          {title: '🥛 Non-Caffeinated', value: 'non-coffee'},
          {title: '🥐 Pastries & Breads', value: 'pastries'},
          {title: '🍳 All-Day Meals', value: 'meals'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),

    // NEW SOCIAL PROOF & TESTIMONIAL FIELDS BLOCK
    defineField({
      name: 'rating',
      title: 'Customer Star Rating',
      type: 'number',
      group: 'social',
      options: {
        list: [
          {title: '⭐⭐⭐⭐⭐ 5 Stars', value: 5},
          {title: '⭐⭐⭐⭐ 4 Stars', value: 4},
        ],
        layout: 'dropdown',
      },
      initialValue: 5,
    }),
    defineField({
      name: 'testimonialAuthor',
      title: 'Testimonial Author Name',
      type: 'string',
      group: 'social',
      description: 'e.g., Joseph A., MSU-IIT Student',
    }),
    defineField({
      name: 'testimonialText',
      title: 'Short Customer Quote',
      type: 'string',
      group: 'social',
      description: 'e.g., "The smoothest cold brew in Iligan, hands down!"',
    }),

    // NEW PROMOTIONAL MARQUEE FIELDS
    defineField({
      name: 'isRecommended',
      title: '⚡ Feature in "Recommended for the Day"?',
      type: 'boolean',
      group: 'status',
      description:
        'Places this product inside the premium daily recommendation banner at the top of the menu.',
      initialValue: false,
    }),
    defineField({
      name: 'isFeatured',
      title: '⭐ Mark as Featured Special?',
      type: 'boolean',
      group: 'status',
      initialValue: false,
    }),
    defineField({
      name: 'isAvailable',
      title: 'Currently in Stock?',
      type: 'boolean',
      group: 'status',
      initialValue: true,
    }),
    defineField({
      name: 'orderPriority',
      title: 'Sorting Priority Order',
      type: 'number',
      group: 'status',
      initialValue: 0,
    }),
  ],
})
