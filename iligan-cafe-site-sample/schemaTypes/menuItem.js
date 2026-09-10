export default {
  name: 'menuItem',
  title: 'Menu Item or Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Item Name',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price (PHP)',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Description or Ingredients',
      type: 'text',
    },
    {
      name: 'isAvailable',
      title: 'Currently in Stock?',
      type: 'boolean',
      initialValue: true
    }
  ]
}
