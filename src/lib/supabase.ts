import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

const getSupabaseBrowserClient = () => {
  if (browserClient) {
    return browserClient
  }

  if (typeof window === 'undefined') {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseBrowserClient()

    if (!client) {
      throw new Error('Supabase client is only available in the browser')
    }

    const value = (client as Record<PropertyKey, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export { getSupabaseBrowserClient }