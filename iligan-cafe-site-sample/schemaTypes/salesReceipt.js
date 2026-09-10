import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'salesReceipt',
  title: 'POS Ledger & Reporting',
  type: 'document',
  groups: [
    {name: 'summary', title: 'Transaction Summary'},
    {name: 'breakdown', title: 'Items Sold'},
  ],
  fields: [
    defineField({
      name: 'receiptId',
      title: 'Receipt Transaction ID',
      type: 'string',
      group: 'summary',
      validation: (Rule) => Rule.required(),
      initialValue: () => `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    }),
    defineField({
      name: 'timestamp',
      title: 'Date & Time Clocked',
      type: 'datetime',
      group: 'summary',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Channel',
      type: 'string',
      group: 'summary',
      options: {
        list: [
          {title: '💵 Cash on Counter', value: 'cash'},
          {title: '📱 GCash Digital', value: 'gcash'},
          {title: '💳 Maya / Card Terminal', value: 'maya'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Gross Revenue (PHP)',
      type: 'number',
      group: 'summary',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'itemsList',
      title: 'Items Log Breakdown',
      type: 'text',
      group: 'breakdown',
      description: 'e.g., 2x Iligan Durian Latte (₱330), 1x Cheese Croissant (₱110)',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'receiptId',
      subtitle: 'totalAmount',
      date: 'timestamp',
    },
    prepare({title, subtitle, date}) {
      const formattedDate = date ? date.split('T')[0] : ''
      return {
        title: `🧾 ${title}`,
        subtitle: `₱${subtitle} PHP | ${formattedDate}`,
      }
    },
  },
})
