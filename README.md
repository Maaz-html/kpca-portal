# KPCA Portal

Unified portal for Kirtane & Pandit (KPCA) to manage Client lifecycle.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI (Python), Pandas/OpenPyxl for Exports.
- **Database/Auth**: Supabase (PostgreSQL with RLS).

## Folder Structure
- `/frontend`: Next.js application.
- `/backend`: FastAPI service.
- `schema.sql`: Database schema definition for Supabase.

## Setup
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (Service Role)
   - `SUPABASE_JWT_SECRET`
4. `python main.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. Set environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `npm run dev`

## Roles
- **PARTNER**: Firm-wide visibility.
- **DIRECTOR**: Full CRUD + Finance visibility.
- **MANAGER**: Portfolio-specific CRUD.
