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
    {name: 'visibility', title: '⚙️ Toggle Visibility'}, // NEW: Dedicated layout control group
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
    }),
    defineField({
      name: 'testimonialText',
      title: 'Short Customer Quote',
      type: 'string',
      group: 'social',
    }),

    // NEW VISIBILITY TOGGLES GRID
    defineField({
      name: 'showCaffeine',
      title: 'Display Caffeine Info?',
      type: 'boolean',
      group: 'visibility',
      description: 'Turn off to hide the caffeine badge on both the card and the modal.',
      initialValue: true,
    }),
    defineField({
      name: 'showRating',
      title: 'Display Star Ratings?',
      type: 'boolean',
      group: 'visibility',
      description: 'Turn off to hide the gold stars from the client view completely.',
      initialValue: true,
    }),
    defineField({
      name: 'showTestimonial',
      title: 'Display Customer Testimonial Quote?',
      type: 'boolean',
      group: 'visibility',
      description:
        'Turn off to temporarily hide the review block layout without deleting the text fields.',
      initialValue: true,
    }),

    // PROMOTIONAL MODIFIERS
    defineField({
      name: 'isRecommended',
      title: '⚡ Feature in "Recommended for the Day"?',
      type: 'boolean',
      group: 'status',
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
