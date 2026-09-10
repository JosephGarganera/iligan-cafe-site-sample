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
    {name: 'visibility', title: '⚙️ Toggle Visibility'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Item Name',
      type: 'string',
      group: 'details',
      description:
        '📌 Enter the official name of the food or beverage as it should appear on the menu card.',
      placeholder: 'e.g., Iligan Durian Cold Brew Latte',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (PHP)',
      type: 'number',
      group: 'details',
      description:
        '📌 Input the gross retail price in Philippine Pesos. Do not include currency symbols.',
      placeholder: 'e.g., 165',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'caffeine',
      title: 'Caffeine Content (mg)',
      type: 'string',
      group: 'details',
      description:
        '📌 Optional: Specify caffeine weight metrics. Leave completely blank for non-coffee items or pastries.',
      placeholder: 'e.g., 120 mg',
    }),
    defineField({
      name: 'description',
      title: 'Description or Ingredients',
      type: 'text',
      group: 'details',
      rows: 2,
      description:
        '📌 Provide an appetizing summary highlighting the flavor profiles or artisanal ingredients.',
      placeholder:
        'e.g., Double shot premium espresso infused with fresh local durian purée over ice.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Menu Category',
      type: 'string',
      group: 'status',
      description:
        '📌 Select the target menu placement folder. This dictates which dynamic tab the item loads into.',
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
      description:
        '📌 Upload a crisp, high-resolution photography asset. Recommended aspect ratio is landscape (4:3 or 16:9).',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Customer Star Rating',
      type: 'number',
      group: 'social',
      description:
        '📌 Choose a default star score metric to display as social proof on the frontend card.',
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
      description: '📌 The customer name and identifier who left the compliment review.',
      placeholder: 'e.g., Joseph G., Tech Consultant',
    }),
    defineField({
      name: 'testimonialText',
      title: 'Short Customer Quote',
      type: 'string',
      group: 'social',
      description:
        '📌 A concise, impactful snippet praising the product to boost social conversion loops.',
      placeholder:
        'e.g., "The combination of local durian and bold robusta espresso is absolutely genius!"',
    }),
    defineField({
      name: 'showCaffeine',
      title: 'Display Caffeine Info?',
      type: 'boolean',
      group: 'visibility',
      description:
        '⚙️ Toggle OFF to temporarily hide the caffeine badge from both public view loops.',
      initialValue: true,
    }),
    defineField({
      name: 'showRating',
      title: 'Display Star Ratings?',
      type: 'boolean',
      group: 'visibility',
      description: '⚙️ Toggle OFF to hide gold stars from the customer interface completely.',
      initialValue: true,
    }),
    defineField({
      name: 'showTestimonial',
      title: 'Display Customer Testimonial Quote?',
      type: 'boolean',
      group: 'visibility',
      description:
        '⚙️ Toggle OFF to temporarily hide the review quote block without deleting the text records.',
      initialValue: true,
    }),
    defineField({
      name: 'isRecommended',
      title: '⚡ Feature in "Recommended for the Day"?',
      type: 'boolean',
      group: 'status',
      description:
        '⚙️ Toggle ON to push this product directly into the daily marquee board spotlight at the top of the menu.',
      initialValue: false,
    }),
    defineField({
      name: 'isFeatured',
      title: '⭐ Mark as Featured Special?',
      type: 'boolean',
      group: 'status',
      description:
        '⚙️ Toggle ON to give this product a prominent double-column signature design container layout.',
      initialValue: false,
    }),
    defineField({
      name: 'isAvailable',
      title: 'Currently in Stock?',
      type: 'boolean',
      group: 'status',
      description:
        '⚙️ Toggle OFF to mark as sold-out, which safely hides it from the frontend to manage real-time inventory.',
      initialValue: true,
    }),
    defineField({
      name: 'orderPriority',
      title: 'Sorting Priority Order',
      type: 'number',
      group: 'status',
      description:
        '📌 Higher numeric values will float this product to the absolute top front of its category tab.',
      placeholder: 'e.g., 10 (Higher numbers display first)',
      initialValue: 0,
    }),
  ],
})
