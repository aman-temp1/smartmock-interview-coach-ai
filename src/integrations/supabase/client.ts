
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://ntmtyrgidorjzfmcpuao.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bXR5cmdpZG9yanpmbWNwdWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDkxNDcsImV4cCI6MjA2MzU4NTE0N30.dDoRcVDmMbTI0-Lbw9pCwjzYwwbGgkjYDqPHDgFS5gk'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
