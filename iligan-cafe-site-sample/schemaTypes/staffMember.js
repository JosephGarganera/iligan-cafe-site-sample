import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'Staff & Shift Tracker',
  type: 'document',
  groups: [
    {name: 'profile', title: 'Staff Profile'},
    {name: 'shift', title: 'Shift Schedule'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      group: 'profile',
      validation: (Rule) => Rule.required().min(2).error("Please input the staff member's name."),
    }),

    defineField({
      name: 'role',
      title: 'Job Role / Title',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          {title: 'Head Barista', value: 'head_barista'},
          {title: 'Junior Barista', value: 'barista'},
          {title: 'Store Manager', value: 'manager'},
          {title: 'Kitchen Staff', value: 'kitchen'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'photo',
      title: 'Staff Photo',
      type: 'image',
      group: 'profile',
      options: {hotspot: true},
      description: 'Upload a professional or friendly portrait photo.',
    }),

    defineField({
      name: 'isOnShift',
      title: 'Currently Clocked In / On Duty?',
      type: 'boolean',
      group: 'shift',
      description: 'Toggle this ON if this person is currently behind the counter right now.',
      initialValue: false,
    }),

    defineField({
      name: 'shiftHours',
      title: 'Scheduled Shift Hours',
      type: 'string',
      group: 'shift',
      description: 'e.g., 9:00 AM - 4:00 PM',
      validation: (Rule) =>
        Rule.custom((currentValue, context) => {
          // Guardrail: If they are marked as on shift, they must specify their shift hours
          if (context.document.isOnShift && !currentValue) {
            return 'Shift hours are required if the staff member is marked as currently on shift!'
          }
          return true
        }),
    }),
  ],

  // Admin Dashboard Custom Visual Preview Configuration
  preview: {
    select: {
      title: 'name',
      role: 'role',
      onShift: 'isOnShift',
      media: 'photo',
    },
    prepare(selection) {
      const {title, role, onShift, media} = selection
      const roleLabels = {
        head_barista: '☕ Head Barista',
        barista: '🥛 Barista',
        manager: '📋 Store Manager',
        kitchen: '🍳 Kitchen Staff',
      }
      return {
        title: title,
        subtitle: `${roleLabels[role] || role} | ${onShift ? '🟢 ON DUTY' : '❌ OFF DUTY'}`,
        media: media,
      }
    },
  },
})
