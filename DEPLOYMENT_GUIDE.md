# OmniMind AI — End-to-End Production Deployment Guide
**Tagline:** "One Input. Every Insight."  
**Target:** Multimodal AI Hackathon Production Deployment  

---

## 1. What You Are Building

OmniMind AI is a production-grade multimodal reasoning platform where users upload PDFs, images (including handwritten notes and scans), audio recordings, and short video files, ask questions via text or voice, and receive answers strictly grounded across ALL their sources with clickable citation chips.

### System Architecture

| Layer | Technology | Hosted On | Purpose |
|---|---|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS | **Vercel** | Interactive 3-panel UI, citation viewer, voice I/O |
| **Backend API** | Node.js (v18+) + Express | **Render** (Web Service) | Multimodal orchestration, token verification, Gemini caller |
| **Database & Auth** | Supabase Cloud (PostgreSQL 15) | **Supabase** | RLS-protected tables, JWT auth, Realtime streaming |
| **Storage** | Supabase Storage (Private S3 bucket) | **Supabase** | Encrypted multimedia file storage (20MB limit) |
| **Multimodal AI** | Google Gemini API (`@google/genai`) | **Google AI Studio** | Cross-modal chunk extraction, grounded JSON reasoning |

### Data Flow Diagram
```
[User Browser]
      │
      ▼
[Vercel Frontend (React + Vite)]
      │
      │  (HTTPS Bearer JWT Token)
      ▼
[Render Backend API (Node.js + Express)]
   ├── 1. Validates Supabase JWT & checks resource ownership
   ├── 2. Queries Supabase DB (RLS-enforced Chunks & Vectors)
   ├── 3. Fetches multimedia buffers from Supabase Private Storage
   └── 4. Calls Google Gemini Multimodal API (Secret Key on backend ONLY)
      │
      ▼
[Structured Evidence JSON with Citations] ──► [Interactive 3-Panel Workspace]
```

---

## 2. Before You Start (Prerequisites)

Ensure you have free developer accounts created on:
1. **GitHub** ([github.com](https://github.com)) — code repository and CD deployment triggers.
2. **Supabase** ([supabase.com](https://supabase.com)) — managed PostgreSQL, Auth, and Storage.
3. **Google AI Studio** ([aistudio.google.com](https://aistudio.google.com)) — Gemini API key.
4. **Render** ([render.com](https://render.com)) — backend Express API hosting.
5. **Vercel** ([vercel.com](https://vercel.com)) — frontend static web application hosting.

### Local Tooling & Version Check Commands
Run these commands in your terminal to ensure prerequisites are installed:
```bash
# Check Node.js (must be 18.0.0 or higher)
node -v

# Check npm (must be 9.0.0 or higher)
npm -v

# Check Git
git --version
```

---

## 3. Get the Code & Repository Structure

Initialize Git (if not already done) and inspect your folder tree:
```bash
git init
git add .
git commit -m "feat: complete OmniMind AI multimodal application"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### Folder Structure
```text
omnimind-ai/
├── frontend/                     # React + Vite + Tailwind CSS (deploys to Vercel)
│   ├── src/
│   │   ├── pages/               # Landing, OmniMind (Workspace), Dashboard, History
│   │   ├── components/          # 3-Panel Workspace, Citations, Audio/Video Viewer
│   │   ├── context/             # Auth, Language (EN/HI/TE), Theme, Toast
│   │   └── api/                 # Axios client with JWT auto-injection
│   ├── vercel.json              # SPA rewrite rule (prevents 404 on refresh)
│   ├── .env.example             # Blank public environment variables
│   └── package.json
├── backend/                      # Node.js + Express API (deploys to Render)
│   ├── src/
│   │   ├── controllers/         # Workspaces, Files, Chat, Studio, Dashboard
│   │   ├── routes/              # /api/workspaces, /api/files, /api/chat, /api/studio
│   │   ├── services/            # Gemini API integration & chunk extraction
│   │   ├── middleware/          # JWT auth, Multer upload, Rate limiting, Error handling
│   │   └── config/              # DB pool, Supabase client, Env validation
│   ├── .env.example             # Blank secret environment variables
│   └── package.json
├── supabase/
│   └── migrations/
│       └── 0001_init.sql        # Full DDL schema, RLS policies, Storage bucket setup
├── demo-data/                    # Engine PDF, lecture audio, and verification scripts
│   ├── IC_Engines_Chapter4.pdf
│   ├── Lecture_Four_Strokes_Prof_Rao.wav
│   └── generate_demo_data.js
├── scripts/
│   └── evaluate.js              # 10-Question automated evaluation suite
├── DEPLOYMENT_GUIDE.md           # This document
├── DEMO_SCRIPT.md                # 5-minute hackathon judge walkthrough
├── PROJECT_SUBMISSION.md         # Problem statement & solution description
└── README.md                     # Architecture, features, and setup
```

---

## 4. PART A: Supabase Setup (Database + Auth + Storage)

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and click **"New project"**.
2. Name the project `omnimind-ai`, enter a database password, and select your preferred region.
3. Once initialized, navigate to **Project Settings** > **API**:
   - Copy **Project URL** (e.g., `https://xyzcompany.supabase.co`).
   - Copy **anon / public key** (safe for frontend use).
   - Copy **service_role key** (secret! ONLY used in backend).
4. Navigate to **SQL Editor** > **New Query**:
   - Open [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql).
   - Paste the complete SQL and click **Run**.
   - This creates `profiles`, `workspaces`, `files`, `chunks`, `conversations`, `messages`, sets up Row Level Security (RLS) on all tables, and creates the private `omnimind-files` Storage bucket.
5. Configure Authentication for smooth demo testing:
   - Navigate to **Authentication** > **Providers** > **Email**.
   - Toggle **OFF** "Confirm email" (so judges can register and log in immediately without waiting for an email confirmation link).

---

## 5. PART B: Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API key"** and select or create a project.
4. Copy the generated key. (Keep this secret; it will only be entered into Render and your local `backend/.env`).

---

## 6. PART C: Run and Verify Locally

### 1. Configure Backend Environment
In `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
DATABASE_URL=postgresql://postgres:your-db-password@db.your-project-id.supabase.co:5432/postgres
JWT_SECRET=your_long_random_jwt_secret_at_least_64_characters_here
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE_MB=20
```

### 2. Configure Frontend Environment
In `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Local Servers
In Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

### 4. Health Check Verification
In Terminal 3:
```bash
curl http://localhost:5000/api/health
# Expected Output: {"ok":true,"time":"...","env":"development"}
```

---

## 7. PART D: Deploy Backend on Render

1. Log in to [Render](https://render.com) and click **"New +"** > **"Web Service"**.
2. Connect your GitHub repository.
3. Configure the Web Service settings:
   - **Name**: `omnimind-backend`
   - **Root Directory**: `backend` (or `BACKEND` if capitalized in repo)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add the **6 Required Environment Variables** in the Render Dashboard:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (leave as `http://localhost:5173` temporarily, update in Part F)
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your_supabase_service_role_key`
5. Click **"Deploy Web Service"**.
6. Once deployed, copy your Render public URL (e.g., `https://omnimind-backend.onrender.com`).
7. Test the health endpoint: `curl https://omnimind-backend.onrender.com/api/health`.

> **Free-Tier Sleep Note:** Render spins down free instances after 15 minutes of inactivity. The initial request can take 20–30 seconds. OmniMind AI's frontend automatically detects this latency and shows a helpful "Waking up the server..." banner to prevent user confusion.

---

## 8. PART E: Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com) and click **"Add New..."** > **"Project"**.
2. Import your GitHub repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (or `FRONTEND` if capitalized in repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add the 3 required public variables:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   - `VITE_API_BASE_URL` = `https://omnimind-backend.onrender.com/api` (Render backend URL with `/api`)
5. Click **"Deploy"**.
6. Copy your deployed Vercel domain (e.g., `https://omnimind-ai.vercel.app`).

---

## 9. PART F: Connect Frontend & Backend (CORS Alignment)

1. Return to your **Render Web Service** settings.
2. Edit the `FRONTEND_URL` environment variable:
   - Value: `https://omnimind-ai.vercel.app` (Exact Vercel URL, **NO trailing slash**).
3. Save changes. Render will automatically redeploy.
4. **Important**: Because Vite inlines `VITE_` variables during the build step, trigger a **Redeploy** on Vercel to ensure the latest API base URL is baked in.

---

## 10. PART G: Supabase Auth Redirect Configuration

1. In the Supabase Dashboard, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to your Vercel URL: `https://omnimind-ai.vercel.app`.
3. Under **Redirect URLs**, add:
   - `https://omnimind-ai.vercel.app/**`
   - `http://localhost:5173/**`
4. Click **Save**.

---

## 11. Testing Checklist

Use this checklist to verify your live deployment:

- [ ] **Registration**: Register a new user at `/register` with password visibility toggle.
- [ ] **Login & Redirection**: Log in at `/login`; verify redirect to `/omnimind` or `/dashboard`.
- [ ] **Workspace Creation**: Create a workspace (e.g. "Engine Thermodynamics").
- [ ] **Universal Upload**:
  - [ ] Upload PDF (`IC_Engines_Chapter4.pdf`).
  - [ ] Upload Audio (`Lecture_Four_Strokes_Prof_Rao.wav`).
  - [ ] Upload Image (`Paracetamol_500mg_Label.jpg`).
- [ ] **File Size & Type Validation**: Verify uploading an unsupported file or >20MB triggers a friendly rejection message.
- [ ] **Cross-Modal Grounding**: Ask "Explain the four strokes using all three sources".
- [ ] **Citation Chips**: Verify citations display filename, page number, timestamp, or bounding box.
- [ ] **Interactive Citation Click**:
  - [ ] Click PDF citation -> PDF viewer jumps to page.
  - [ ] Click Audio citation -> Player seeks to timestamp (`02:15`).
  - [ ] Click Image citation -> Highlights bounding box on canvas.
- [ ] **Output Studio**:
  - [ ] Generate Executive Summary.
  - [ ] Switch explanation level: Beginner -> Intermediate -> Advanced.
  - [ ] Take 4-question interactive Quiz.
  - [ ] Flip Revision Flashcards.
  - [ ] View Labeled Diagram description.
  - [ ] Click "Listen" button -> Speaks recap via browser Web Speech API.
- [ ] **Trilingual Support**: Switch language to Hindi and Telugu; verify text and voice.
- [ ] **Modes**: Test Mode Switcher across LearnAble, VisionVoice, VisionCart, KitchenMate, HealthLens, and RoadSense.
- [ ] **Persistent Disclaimers**: Verify HealthLens shows non-diagnostic advisory and RoadSense shows simulation label.
- [ ] **Refresh & History**: Hard refresh (`Ctrl+F5`); verify state persists and history can be viewed/deleted.
- [ ] **Responsive Design**: Open Chrome DevTools in iPhone/Android mode; verify mobile navigation works.

---

## 12. Troubleshooting Table

| Issue / Error | Root Cause | Solution |
|---|---|---|
| `CORS error: origin https://... not allowed` | `FRONTEND_URL` on Render doesn't match Vercel URL, or contains a trailing slash. | Set `FRONTEND_URL=https://your-site.vercel.app` (no `/` at end) on Render and wait for restart. |
| Slow initial request (20-30s) | Render Free Tier sleeps after 15 mins of inactivity. | Normal behavior. The frontend displays "Waking up server..." banner. Subsequent calls take <300ms. |
| Confirmation email link redirects to `localhost:3000` | Supabase Site URL is default localhost. | Go to Supabase > Authentication > URL Configuration and set Site URL to your Vercel URL. |
| `Invalid or expired token. Please log in again.` | JWT signature mismatch or expired session. | Clear browser `localStorage` or re-login. Verify `JWT_SECRET` is consistent. |
| Gemini API quota or failure | Invalid API key or quota exceeded. | Check key on [aistudio.google.com](https://aistudio.google.com). Backend includes deterministic offline fallback so demo never crashes. |
| Blank page on refreshing `/omnimind` or `/cases` | Client-side routing not rewritten by static host. | Ensure `frontend/vercel.json` contains `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`. |
| Environment variable changes not showing in frontend | Vite compiles `VITE_` variables into static JS at build time. | Trigger a "Redeploy with existing build cache cleared" on Vercel after changing env vars. |
| Backend won't start in production | Missing required environment variables. | Ensure all 6 required env vars are present in Render dashboard. |

---

## 13. Environment Variables Cheat Sheet

### Backend Environment Variables (Render) — 6 Required
| Variable | Required | Example |
|---|---|---|
| `PORT` | Yes | `5000` |
| `FRONTEND_URL` | Yes | `https://omnimind-ai.vercel.app` |
| `GEMINI_API_KEY` | Yes | `AIzaSy...` |
| `SUPABASE_URL` | Yes | `https://xyzcompany.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | `eyJhbGci...` (Secret!) |

### Frontend Environment Variables (Vercel) — 3 Required
| Variable | Required | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | `eyJhbGci...` |
| `VITE_API_BASE_URL` | Yes | `https://omnimind-backend.onrender.com/api` |

---

## 14. Security Notes & Continuous Deployment

1. **Secret Isolation**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively in the Render backend environment. They are NEVER sent to the client browser.
2. **Row Level Security (RLS)**: Enforced directly at the PostgreSQL layer. Even if a user attempts to forge API requests, Supabase RLS guarantees they can only read and write rows where `auth.uid() = user_id`.
3. **Storage Security**: The `omnimind-files` bucket is strictly private. Files are downloaded via short-lived signed URLs or backend service proxies.
4. **Auto-Deploy on Git Push**: Both Render and Vercel are connected to the `main` branch. Pushing any update to `main` will automatically trigger linting, testing, and continuous deployment.
