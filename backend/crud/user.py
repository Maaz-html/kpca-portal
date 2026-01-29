from supabase import Client
from typing import List, Optional

def get_users(db: Client):
    # Fetching from 'profiles' table which maps to auth.users
    result = db.table("profiles").select("*").execute()
    return result.data

def update_user_role(db: Client, user_id: str, role: str):
    result = db.table("profiles").update({"role": role}).eq("id", user_id).execute()
    return result.data[0]
