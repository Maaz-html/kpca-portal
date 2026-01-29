import { createClient } from '@supabase/supabase-js';

const getSafeEnv = (key: string): string | undefined => {
    const val = process.env[key];
    if (!val || val === 'undefined' || val === 'null' || val.trim() === '') {
        return undefined;
    }
    return val.trim();
};

const supabaseUrl = getSafeEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getSafeEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// During Next.js build-time (prerendering), we MUST provide a valid-looking URL
// even if the environment variables aren't injected yet.
const isPrerendering = typeof window === 'undefined';
const hasValidConfig = !!(supabaseUrl && supabaseUrl.startsWith('http'));

export const supabase = createClient(
    hasValidConfig ? supabaseUrl! : 'https://build-time-placeholder.supabase.co',
    hasValidConfig ? supabaseAnonKey! : 'build-time-placeholder-key'
);
