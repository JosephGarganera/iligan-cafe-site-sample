import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item or Product',
  type: 'document',
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
      description: 'e.g., 100 mg (Leave blank for pastries)',
    }),
    defineField({
      name: 'description',
      title: 'Description or Ingredients',
      type: 'text',
      group: 'details',
      rows: 3,
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
      name: 'isFeatured',
      title: ' ⭐ Mark as Featured Special?',
      type: 'boolean',
      group: 'status',
      description: 'Gives the item a prominent signature spotlight layout section.',
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
