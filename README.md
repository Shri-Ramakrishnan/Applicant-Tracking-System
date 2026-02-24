# ATS - Applicant Tracking System (MERN Stack)

A full-featured Applicant Tracking System built with MongoDB, Express.js, React (Vite), and Node.js.

## Features

- **Job Posting** — Recruiters can create and manage job listings
- **Application Submission** — Applicants upload resumes and apply to jobs
- **Resume Screening** — Automatic keyword-based scoring (pdf-parse)
- **Interview Scheduling** — With conflict detection (1-hour buffer per recruiter)
- **Offer Management** — Generate offers, applicants can accept/reject
- **Status Tracking** — Applied → Screened → Shortlisted → Interview Scheduled → Offered/Rejected
- **Email Notifications** — Nodemailer on shortlist, interview, and offer
- **JWT Authentication** — Role-based access (recruiter / applicant)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT (localStorage) |
| File Upload | Multer (PDF only) |
| PDF Parsing | pdf-parse |
| Email | Nodemailer |
| Testing | Jest, Supertest |

## Project Structure

```
ats-mern/
├── backend/
│   ├── config/db.js
│   ├── models/           # User, Recruiter, Applicant, Job, Resume, Application, InterviewSchedule, Offer
│   ├── routes/           # authRoutes, jobRoutes, applicationRoutes, interviewRoutes, offerRoutes
│   ├── controllers/      # authController, jobController, applicationController, interviewController, offerController
│   ├── middleware/        # auth.js (JWT), errorHandler.js, upload.js (Multer)
│   ├── services/         # emailService.js, screeningService.js
│   ├── utils/seed.js     # Sample data seeder
│   ├── tests/            # auth.test.js, application.test.js
│   └── server.js
└── frontend/
    └── src/
        ├── context/AuthContext.jsx
        ├── services/api.js
        ├── pages/         # Login, Register, JobList, JobDetail, MyApplications, RecruiterJobs, CreateJob, JobApplications, ScheduleInterview, GenerateOffer, Interviews
        ├── components/    # Navbar, StatusBadge
        └── App.jsx
```

## Setup & Run

### 1. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cp .env.example backend/.env
# Edit backend/.env with your MongoDB URI, JWT secret, and email credentials
```

### 3. Seed Database (Optional)

```bash
cd backend && npm run seed
# Creates demo accounts:
# Recruiter: recruiter@ats.com / password123
# Applicant: applicant@ats.com / password123
```

### 4. Start Backend

```bash
cd backend && npm run dev
# Runs on http://localhost:5000
```

### 5. Start Frontend

```bash
cd frontend && npm run dev
# Runs on http://localhost:3000
```

### 6. Run Tests

```bash
cd backend && npm test
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register (recruiter/applicant)
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile (protected)

### Jobs
- `GET /api/jobs` — All active jobs (public)
- `GET /api/jobs/my-jobs` — Recruiter's jobs (recruiter)
- `POST /api/jobs` — Create job (recruiter)
- `PATCH /api/jobs/:id/status` — Toggle job status (recruiter)

### Applications
- `POST /api/applications/apply/:jobId` — Apply with PDF resume (applicant)
- `GET /api/applications/my` — My applications (applicant)
- `GET /api/applications/job/:jobId` — Applications for a job (recruiter)
- `PATCH /api/applications/:id/screen` — Mark screened (recruiter)
- `PATCH /api/applications/:id/shortlist` — Shortlist + email (recruiter)
- `PATCH /api/applications/:id/reject` — Reject (recruiter)

### Interviews
- `POST /api/interviews/schedule` — Schedule interview with conflict check (recruiter)
- `GET /api/interviews/my` — Recruiter's interviews (recruiter)
- `PATCH /api/interviews/:id/status` — Update status (recruiter)

### Offers
- `POST /api/offers/generate` — Generate offer + email (recruiter)
- `GET /api/offers/application/:applicationId` — Get offer for application
- `PATCH /api/offers/:id/respond` — Accept/Reject offer (applicant)

## Business Rules Implemented

- **Duplicate Application Prevention** — MongoDB unique index on (job, applicant)
- **Interview Conflict Prevention** — 1-hour buffer check per recruiter
- **Resume Screening** — Keyword extraction and percentage scoring
- **Email Notifications** — Non-blocking on shortlist, interview schedule, offer
- **Role-Based Access** — Middleware guards for recruiter-only and applicant-only routes
