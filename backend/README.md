# Fitness Buddy App - Backend 🟢

This is the Express.js backend API repository for the **Fitness Buddy** Full Stack project.

## 🌐 Project Overview
The Fitness Buddy Backend is a REST API designed to safely serve workout and exercise data to the frontend, integrating deeply with a Supabase PostgreSQL database. It features secure routes and CRUD operations built seamlessly with modern Node.js standards (ES Modules).

## 🛠️ Tech Stack
- **Runtime Environment**: Node.js
- **Server Framework**: Express.js
- **Database & Auth**: Supabase (@supabase/supabase-js)
- **Configuration**: dotenv
- **Middleware**: CORS, Express JSON Parser
- **Deployment**: Render (Target)

## 📋 API Documentation
The API lives under the `/api` prefix. Here are the core endpoints:

### Base Path `GET /health`
Returns the status of the API server (`200 OK`).

### Workouts `/api/workouts`
- `GET /api/workouts`
  - Retrieves all logged workouts ordered by date.
- `GET /api/workouts/:id`
  - Retrieves a specific workout by UUID.
- `POST /api/workouts`
  - Body Params: `{ user_id, title, date, notes }`
  - Creates a new workout log.
- `PUT /api/workouts/:id`
  - Body Params: `{ title, date, notes }`
  - Updates an existing workout log.
- `DELETE /api/workouts/:id`
  - Deletes a specific workout log.

*(Future additions will include `exercises` API under `/api/exercises`.)*

## 🗄️ Database Schema Explanation
We use **Supabase (PostgreSQL)**.
1. `users` (Managed entirely by Supabase GoTrue Auth system)
2. `workouts` Table:
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (Foreign Key to auth.users, optional if handled purely stateless proxy)
   - `title`: String
   - `date`: DateTime
   - `notes`: Text
   - `created_at`: TSTZ
3. `exercises` Table:
   - `id`: UUID (Primary Key)
   - `workout_id`: UUID (Foreign Key to workouts.id)
   - `name`: String
   - `sets`: Integer
   - `reps`: Integer
   - `weight`: Numeric

The application is highly normalized, separating users, unique workout instances, and the individual exercises performed during those instances.

## 🚀 Installation Steps
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Set up environment variables based on `.env`:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Start the development server with Hot Module Reload (Watch): `npm run dev` OR production: `npm start`

## 🔗 Links
- **Deployment Link**: `[Insert Render Deployment Link Here]`
