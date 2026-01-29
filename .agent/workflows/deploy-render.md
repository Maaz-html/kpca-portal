---
description: How to deploy the KPCA Portal Backend to Render
---

Follow these steps to host your FastAPI backend on Render.

### 1. Preparation
1. Ensure your code is pushed to a GitHub repository.
2. Go to [Dashboard.render.com](https://dashboard.render.com) and log in.

### 2. Create Web Service
1. Click **"New +"** and select **"Web Service"**.
2. Connect your GitHub repository.

### 3. Configure Service
1. **Name**: Give it a name (e.g., `kpca-backend`).
2. **Root Directory**: Set this to `backend`.
3. **Environment**: Select **Python 3**.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`

### 4. Set Environment Variables
Click on **"Advanced"** or **"Environment"** and add these keys from your Supabase Dashboard:

| Key | Value |
| :--- | :--- |
| `SUPABASE_URL` | *Your Supabase Project URL* |
| `SUPABASE_KEY` | *Your Service Role Key* (Do not use ANON key here) |
| `SUPABASE_JWT_SECRET` | *Your JWT Secret* |
| `PYTHON_VERSION` | `3.11` (or whichever version you prefer) |

### 5. Deploy
1. Click **"Create Web Service"**.
2. Wait for the build and deployment (it takes 2-3 minutes).
3. Once live, Render will give you a URL like `https://kpca-backend.onrender.com`.

### 6. Linking to Frontend
Copy that URL and add `/api` to the end (e.g., `https://kpca-backend.onrender.com/api`). This is what you will put into Vercel as your `NEXT_PUBLIC_API_URL`.
