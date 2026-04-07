# Student Engagement Tracker Backend

Node/Express backend for the Intelligent Student Engagement Tracker (MySQL).

## Setup

1. Create a MySQL database and configure the backend `.env` file in `backend/`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_engagement_tracker
DB_PORT=3306
JWT_SECRET=change-this-in-production
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

2. Install dependencies and start the server:

```bash
cd backend
npm install
npm run start
```

Optional: create tables + seed sample data

```bash
npm run init-db
```

## Endpoints

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Students
- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

Notifications
- `GET /api/notifications`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

Engagement
- `GET /api/engagements`
- `GET /api/engagements/:id`
- `POST /api/engagements`
- `PUT /api/engagements/:id`
- `DELETE /api/engagements/:id`

Reports
- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports`
- `PUT /api/reports/:id`
- `DELETE /api/reports/:id`

## Notes

- Write operations require a valid JWT token in `Authorization: Bearer <token>`.
- Read operations are open by default.
