import { defineConfig } from '@prisma/define-config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL!,   // Your Supabase URL
    },
  },
})
