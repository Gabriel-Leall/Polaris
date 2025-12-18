import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': '"https://test.supabase.co"',
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': '"test-anon-key"',
  },
})