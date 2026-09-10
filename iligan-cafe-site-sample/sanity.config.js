import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemaTypes'
import DashboardView from './components/DashboardView' // Import our reporting panel

export default defineConfig({
  name: 'default',
  title: 'Iligan Cafe SaaS Node',

  projectId: 'pd1a3die',
  dataset: 'production',

  // 1. Keep base database editing tables active
  plugins: [deskTool()],

  // 2. FIXED: Mount the analytics panel using the official "tools" array option!
  tools: (prev) => [
    ...prev,
    {
      name: 'accounting-dashboard',
      title: '📊 Business Analytics Panel',
      component: DashboardView,
    },
  ],

  schema: {
    types: schemaTypes,
  },
})
