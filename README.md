# SynapNote — AI-Enhanced Knowledge Workspace

## Abstract
SynapNote is a secure, AI-enhanced knowledge workspace that helps users create, organize, and interact with notes. It combines a React frontend (Vite + Tailwind) with a Node.js + Express backend and MongoDB. The backend provides authentication (OTP + JWT), notes CRUD, AI-powered summaries/keyword extraction and conversational features. Email delivery for OTP and password flows is provided via Nodemailer. The project is split into two folders: `SynapNote-frontend` and `SynapNote-Backend`.

**Contents**
- Frontend: user interface, routing, client-side state and API calls (`SynapNote-frontend/`)
- Backend: RESTful API, authentication, AI services, database models (`SynapNote-Backend/`)

---

**Quick Start (Windows PowerShell)**

1. Install backend dependencies and start backend

```powershell
cd SynapNote-Backend
npm install
copy .env.example .env    # then fill in values
npm run dev
```

2. Install frontend dependencies and start frontend

```powershell
cd ..\SynapNote-frontend
npm install
npm run dev
```

Open the frontend URL shown by Vite (usually `http://localhost:5173`) and ensure the backend is running (default `http://localhost:5000`).

---

**Frontend (what it does & key files)**

- Purpose: Provide a responsive UI for sign-up/sign-in flows, creating and editing notes, searching, tagging, and viewing AI-generated summaries and conversations.
- Tech stack: React, Vite, Tailwind CSS, PostCSS, ESLint.
- Key files & folders:
  - `src/App.jsx` — main app shell and routes registration.
  - `src/main.jsx` — React app entry.
  - `src/pages/` — page-level components (e.g., `Dashboard.jsx`, `CreateNote.jsx`, `NoteDetail.jsx`).
  - `src/components/` — reusable components (Navbar, ProtectedRoute, LoadingSpinner).
  - `src/context/AuthContext.jsx` — authentication state and token management.
  - `src/context/NotesContext.jsx` — notes state and CRUD actions.
  - `src/services/api.js` — wrapper for HTTP calls to backend; attaches JWT to `Authorization` header when present.

How the frontend interacts with the backend:
- On sign-up/sign-in, frontend calls the auth endpoints to create accounts and receive JWT tokens.
- The token is stored in client context and attached to requests to protected endpoints.
- Creating or updating a note triggers AI-enhancement requests (title generation, content generation, summary extraction) via backend endpoints that call AI services.

---

**Backend (what it does & key files)**

- Purpose: Expose RESTful endpoints for authentication, notes management, AI integration, and email workflows. Persist data to MongoDB and secure routes with JWT verification and OTP flows.
- Tech stack: Node.js, Express, MongoDB, Mongoose, Bcrypt, JWT, Nodemailer, Google Gemini (or other LLM) via `services/aiServices.js`.
- Key files & folders:
  - `server.js` — starts Express, configures middleware (CORS, JSON), and mounts routes.
  - `config/db.js` — MongoDB connection.
  - `routes/authRoutes.js` — auth endpoints.
  - `routes/notesRoutes.js` — notes & conversation endpoints.
  - `controllers/authController.js` — signup, signin, OTP generation/verification, forgot/reset password.
  - `controllers/notesController.js` — notes CRUD, search, AI generation, conversations.
  - `services/aiServices.js` — wraps calls to the AI provider (generate title, content, summary, keywords, chat responses).
  - `services/mailSender.js` — Nodemailer configuration and email templates for OTP/reset.
  - `models/` — Mongoose models: `User.js`, `Notes.js`, `Conversation.js`.
  - `middlewares/auth.js` — JWT verification middleware that attaches `req.user`.

Security & auth flow (high-level):
- Passwords are hashed with `bcrypt` before saving.
- On signup, an OTP is generated and emailed to verify the address; once verified an `emailVerified` flag is set.
- On sign-in, the server verifies password and `emailVerified`, then issues a JWT.
- Protected routes require `Authorization: Bearer <token>` header validated by `middlewares/auth.js`.

---

**API Reference (Backend routes)**

Base URL: `http://localhost:<PORT>/api` (default `PORT` usually `5000`).

Auth routes (`SynapNote-Backend/routes/authRoutes.js`)
- `POST /api/auth/signup` — Create a new user. Request: `{ name, email, password }`. Server hashes password, creates user, generates OTP, and emails it.
- `POST /api/auth/signin` — Authenticate user. Request: `{ email, password }`. Response: `{ token, user }` on success.
- `POST /api/auth/verifyotp` — Verify OTP sent to email. Request: `{ email, otp }`. Marks `emailVerified` true.
- `POST /api/auth/forgotpassword` — Start password-reset flow. Request: `{ email }`. Sends OTP or reset link.
- `POST /api/auth/resetpassword` — Complete password reset. Request: `{ email, otp, newPassword }` (or token-based).
- `GET /api/auth/me` — (Protected) Return the current user from token. Header: `Authorization: Bearer <token>`.

Notes routes (`SynapNote-Backend/routes/notesRoutes.js`) — all routes are protected (require JWT header):
- `POST /api/notes/` — Create a note. Request body includes `title`, `body`, `tags` etc. Controller: `createNote` — also triggers AI metadata generation if configured.
- `GET /api/notes/` — Get all notes for the authenticated user. Controller: `getNotes`.
- `GET /api/notes/:id` — Get single note by id. Controller: `getNote`.
- `PUT /api/notes/:id` — Update an existing note. Controller: `updateNote`.
- `DELETE /api/notes/:id` — Delete a note. Controller: `deleteNote`.
- `GET /api/notes/search` — Search notes by query string (query param `q`). Controller: `searchNotes`.
- `GET /api/notes/tags/:tag` — Get notes filtered by a tag. Controller: `getNotesByTag`.
- `POST /api/notes/gen-title/:id` — Generate a title for a note (AI). Controller: `generateTitle`.
- `POST /api/notes/gen-content` — Generate content (AI) for a draft. Controller: `generateContent`.
- `POST /api/notes/improve-content` — Improve provided content (AI). Controller: `improveContentController`.

Chat/Conversation routes (note-centric):
- `POST /api/notes/:id/chat` — Chat with a note (send user message, get AI response). Controller: `chatWithNote`.
- `GET /api/notes/:id/conversations` — Get conversation history for a note. Controller: `getConversationHistoryController`.
- `PUT /api/notes/conversations/:sessionId/clear` — Clear conversation history for a session. Controller: `clearConversationController`.
- `DELETE /api/notes/conversations/:sessionId` — Delete a conversation session. Controller: `deleteConversationController`.

Notes on request/response and protection:
- All notes routes use `middlewares/auth.js` to require a valid JWT.
- When the frontend calls AI-related endpoints, the backend calls the configured AI provider using `AI_API_KEY` and returns processed results to the client. The backend may also persist AI outputs in `notes.aiMetadata`.

---

**Environment variables**
Create `.env` from `.env.example` for both backend and frontend (if present). Important variables for backend:
- `PORT` — server port
- `MONGODB_URI` — connection string
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — token lifetime
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP creds for Nodemailer
- `AI_API_KEY` — key for Google Gemini or chosen LLM provider
- `FRONTEND_URL` — allowed origin (for CORS)

---

