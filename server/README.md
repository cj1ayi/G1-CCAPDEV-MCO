# AnimoSpaces - Backend (Phase 2)

AnimoSpaces is a community forum platform designed exclusively for De La 
Salle University students. This repository contains the Phase 2 
implementation of the backend logic.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance)

## Installation & Setup

1. Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in the `server` directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/animospaces
   SESSION_SECRET=any_random_string

   # Google OAuth (Optional for grading, see Bypass below)
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

3. **CRITICAL: Seed the Database**
   This populates the 5 required users, posts, and comments.
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## How to Grade / Test Login

Since Google OAuth requires specific API keys and authorized domains, we 
have implemented a **Grading Bypass** to allow full access to all features:

1. Ensure the server and frontend are both running.
2. Open your browser and go to: `http://localhost:3000/api/auth/grading-login`
3. You will be automatically logged in as the seeded user **tiamlee** and 
   redirected to the Explore page.
4. You can now test Create Post, Voting, Joining Spaces, and Profile 
   editing.

## Project Structure

- `src/models/`: Mongoose schemas (User, Post, Comment, Space, Vote).
- `src/controllers/`: Logic for API requests.
- `src/routes/`: Express route definitions.
- `src/middleware/`: Validation logic.
