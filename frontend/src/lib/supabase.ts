import { createClient } from '@supabase/supabase-js';

const getValidUrl = (url: string | undefined): string => {
    // Check if the URL is a real HTTP(S) string
    if (typeof url === 'string' && url.trim().length > 0 && url.startsWith('http')) {
        return url.trim();
    }
    // Return a valid dummy URL during build to prevent crash
    // This allows the build to finish; the real URL will be used at runtime in the browser.
    return 'https://placeholder-build-url.supabase.co';
};

const getValidKey = (key: string | undefined): string => {
    if (typeof key === 'string' && key.trim().length > 0) {
        return key.trim();
    }
    return 'placeholder-key';
};

export const supabase = createClient(
    getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);
