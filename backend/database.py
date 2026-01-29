from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # Service role key for admin operations

if not SUPABASE_URL or not SUPABASE_KEY:
    # We will need these for production, for now we log a warning
    print("Warning: SUPABASE_URL or SUPABASE_KEY not set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def get_supabase():
    if not supabase:
        raise Exception("Supabase client not initialized. Check environment variables.")
    return supabase
