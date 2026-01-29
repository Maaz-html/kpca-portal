---
description: Start the KPCA Portal locally
---

This workflow will start both the backend and frontend services.

### Prerequisites
1. Ensure Python 3.9+ and Node.js 18+ are installed.
2. Fill in the `.env` files in both `/backend` and `/frontend` using the provided `.env.example` templates.

### Running the Application

1. **Terminal 1: Start Backend**
   ```powershell
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. **Terminal 2: Start Frontend**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
