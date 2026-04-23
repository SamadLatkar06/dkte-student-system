import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Keeps runtime errors understandable in non-configured environments.
  console.warn('Supabase environment variables are missing.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
