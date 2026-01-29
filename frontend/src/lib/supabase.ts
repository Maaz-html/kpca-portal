import { createClient } from '@supabase/supabase-js';

// Next.js requires explicit process.env.NAME for static replacement at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isTrueConfig = supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('placeholder');

export const supabase = createClient(
    isTrueConfig ? supabaseUrl : 'https://build-time-placeholder.supabase.co',
    isTrueConfig ? supabaseAnonKey! : 'build-time-placeholder-key'
);
