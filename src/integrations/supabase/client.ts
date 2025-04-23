
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iyiwpwtqtqzsmebeeoml.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aXdwd3RxdHF6c21lYmVlb21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MDEwMTQsImV4cCI6MjA2MDk3NzAxNH0.QvzpdlOxyProev823iYqX7h11u_MwvG2CIkNeCS_uNY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
  }
});
