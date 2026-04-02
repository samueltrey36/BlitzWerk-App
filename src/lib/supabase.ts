import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        `[Supabase] Missing env vars for client. ` +
        `VITE_SUPABASE_URL=${supabaseUrl ? '***set***' : 'undefined'}, ` +
        `VITE_SUPABASE_ANON_KEY=${supabaseAnonKey ? '***set***' : 'undefined'}`
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)