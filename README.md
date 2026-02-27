# Portfolio Builder

A full-stack portfolio builder with:
- Django REST API (`backend/`)
- React + Vite frontend (`frontend/portfolio-maker/`)

## Local Development

Backend:
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:
```bash
cd frontend/portfolio-maker
npm install
npm run dev
```

## Deploy Plan

- Frontend: Vercel
- Backend + PostgreSQL: Render

### 1. Deploy Backend + Database on Render

This repo includes a Render Blueprint file at `render.yaml`.

1. Push to GitHub.
2. In Render, click `New +` -> `Blueprint`.
3. Select this repository.
4. Render will create:
   - `portfolio-db` PostgreSQL
   - `portfolio-backend` web service
5. After deploy, open backend service env vars and set:
   - `CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>.vercel.app`
   - If you use a custom frontend domain, also set it there (comma-separated).

Health endpoint for Render:
- `GET /health/` (returns `{"status":"ok"}`)

### 2. Deploy Frontend on Vercel

Use project root:
- `frontend/portfolio-maker`

Vercel settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Environment Variable:
- `VITE_API_URL=https://<your-render-backend>.onrender.com`

SPA routing support is included via:
- `frontend/portfolio-maker/vercel.json`

## Production Notes

- Backend production config is environment-driven in `backend/backend/settings.py`.
- Render build script is `backend/build.sh`.
- Image uploads currently use Django filesystem storage. On Render, ephemeral files may be lost unless you attach persistent storage or use external object storage (S3/Cloudinary).
