# AnimoSpaces - Backend (Phase 2)

AnimoSpaces is a community forum platform designed exclusively for De La 
Salle University students. This repository contains the Phase 2 
implementation of the backend logic, including database schemas, RESTful 
controllers, and API routing.

## Prerequisites

Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance 
  or MongoDB Atlas URI)

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the `server` directory and provide the following 
variables.

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/animospaces
SESSION_SECRET=your_session_secret_here

# Google OAuth Credentials (Required for Login functionality)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

## Database Seeding

To fulfill the requirement of having at least 5 sample users, posts, and 
comments, run the built-in seed script. This will wipe existing collections 
and populate the database with life-like sample data.

```bash
npm run seed
```

## Running the Server

Start the development server using `tsx`. The server will be accessible at 
`http://localhost:3000`.

```bash
npm run dev
```

## Project Structure

- `src/models/`: Mongoose schemas for Users, Posts, Comments, Spaces, and 
  Votes.
- `src/controllers/`: Logic for handling API requests and database 
  interactions.
- `src/routes/`: Express route definitions for all features.
- `src/middleware/`: Validation rules using `express-validator`.
- `src/config/`: Passport.js and Database connection configurations.

## API Features Implemented

- **Authentication:** Google OAuth 2.0 restricted to @dlsu.edu.ph domains.
- **Spaces:** Full CRUD for community spaces.
- **Posts:** Paginated feed, creation, editing, and deletion.
- **Comments:** Nested threading logic with support for soft-deletes.
- **Voting:** Polymorphic voting system for both posts and comments.
- **Profiles:** User-specific activity tracking (posts, comments, upvotes).
