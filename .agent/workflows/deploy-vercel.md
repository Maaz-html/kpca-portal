---
description: How to deploy the KPCA Portal Frontend to Vercel
---

Follow these steps to host your frontend on Vercel.

### 1. Preparation
1. Ensure your code is pushed to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and log in (using GitHub is easiest).

### 2. Import Project
1. In the Vercel Dashboard, click **"Add New..."** and then **"Project"**.
2. Find your `kpca-portal` repository and click **"Import"**.

### 3. Configure Project
1. **Root Directory**: Click the "Edit" button next to the project name and select the `frontend` folder. Vercel needs to know the app is in that sub-directory.
2. **Framework Preset**: Vercel should automatically detect **Next.js**.

### 4. Set Environment Variables
Open the **"Environment Variables"** dropdown and add the following keys. You can get these from your Supabase dashboard:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | *Your Render Backend URL* (e.g., `https://kpca-api.onrender.com/api`) |
| `NEXT_PUBLIC_SUPABASE_URL` | *Your Supabase Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Your Supabase Anon/Public Key* |

### 5. Deploy
1. Click **"Deploy"**.
2. Wait about 1-2 minutes for the build to finish.
3. Vercel will give you a public URL (e.g., `https://kpca-portal.vercel.app`).

### 6. Final Step (Cross-Origin)
Once you have your Vercel URL, go to your **Render Dashboard** (backend) and add the Vercel URL to your CORS settings if you've restricted them, or simply ensure the backend allows requests from that domain.
