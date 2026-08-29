import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

const DEFAULT_SUPABASE_URL = 'https://rgqthyeucztrqndkxtuo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXRoeWV1Y3p0cnFuZGt4dHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzU1NDgsImV4cCI6MjEwMzUxMTU0OH0.gKiwG1SdAeX2BystvrjeLCXG5tWjL5h5wfdM_P-dqNM';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
