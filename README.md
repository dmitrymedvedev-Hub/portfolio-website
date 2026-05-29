# Portfolio Website

The project is now split into `frontend` and `backend` folders.

## Structure

```text
frontend/
  index.html
  css/styles.css
  js/main.js

backend/
  package.json
  .env.example
  src/
  sql/schema.sql
```

## Frontend

Open `frontend/index.html` in a browser or serve the folder with a static dev server.
The page loads projects from the API and sends contact form submissions to the backend.

New pages added:
- `frontend/projects.html` — standalone projects listing page.
- `frontend/project.html` — project details page (opened from listing).
- `frontend/404.html` and `frontend/500.html` — friendly error pages.

Quick static serve example (using `http-server`):

```bash
cd frontend
npx http-server -c-1 -p 8080
# then open http://localhost:8080
```

## Backend

Install dependencies inside `backend` and start the API:

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Database Setup in phpMyAdmin

1. Open phpMyAdmin.
2. Import `backend/sql/schema.sql`.
3. Update `backend/.env` with your MySQL credentials.

The schema creates:

- `projects` for portfolio items
- `contacts` for form submissions

## API Endpoints

- `GET /api/health`
- `GET /api/portfolio/projects`
- `GET /api/portfolio/projects/:id`
- `POST /api/contact/submit`
- `GET /api/contact/all`

## Notes

- No Pug templates are used.
- The backend is API-only.
- The frontend and backend are intentionally separated for easier maintenance.
