# AnimoSpaces Backend 

## Quick Start

Follow these steps to get the server running on your local machine.

### 1. Prerequisites
- Ensure you have **Node.js (v18 or higher)** installed.
- Ensure you have been added to the **MongoDB Atlas Project** (ask the project lead).
- Ensure you have been added to the **Google Cloud Console Project** (for Auth).

### 2. Installation
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm ci
```

### 3. Environment Setup
The `.env` file is ignored by GitHub for security. You must create one manually in the `server` root:
```bash
touch .env
```
Ask the team lead for the values of the following variables and paste them in:
- `MONGODB_URI`
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CALLBACK_URL`

Sample .env file:
```
PORT=3000

MONGODB_URI=why.is.6.scared.of.7?6767 --> you need this
SESSION_SECRET=  -----------------------> this can be anything
GOOGLE_CLIENT_ID=cus.789omnomnom  ------> and this
GOOGLE_CLIENT_SECRET=wow  --------------> and this

CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 4. Database Seeding
Populate the database with sample data:
```bash
npm run seed
```
*Warning: This will wipe your local database collections and reset them to the mock data.*

### 5. Running the Server
Start the development server:
```bash
npm run dev
```
The server will run at `http://localhost:3000`.

---

## Testing

Use browser console developer tools.

### Step 1: Authentication
1. Open your browser and go to `http://localhost:3000/api/auth/google`.
2. Log in using your **@dlsu.edu.ph** account.
3. Verify login by visiting `http://localhost:3000/api/auth/me`.

### Step 2: Manual Testing (via Console)
Go to `http://localhost:3000`, open **F12 Developer Tools > Console**, and use these snippets:

#### Create a Post
```javascript
fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Testing the Backend",
    content: "This is a test post from the console.",
    space: "freedom-wall",
    tags: ["test", "ccapdev"]
  })
}).then(res => res.json()).then(console.log);
```

#### Create a Comment
```javascript
fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    postId: "PASTE_POST_ID_HERE",
    content: "This is a test comment!"
  })
}).then(res => res.json()).then(console.log);
```

#### Vote on a Post
```javascript
fetch('/api/votes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    targetId: "PASTE_POST_ID_HERE",
    targetType: "Post",
    value: 1 // 1 for upvote, -1 for downvote
  })
}).then(res => res.json()).then(console.log);
```

---

## MVC Architecture

- **Models (`/src/models`)**: Mongoose schemas defining the data structure.
- **Controllers (`/src/controllers`)**: Logic for handling requests and interacting with models.
- **Routes (`/src/routes`)**: URL endpoints mapping to controllers.
- **Middleware (`/src/middleware`)**: Auth checks and `express-validator` rules.
- **Config (`/src/config`)**: Database connection and Passport strategy.

## Rubric Checklist
- [x] **MVC Architecture**: Followed strictly.
- [x] **Database**: MongoDB Atlas integrated via Mongoose.
- [x] **CRUD**: Implemented for Posts, Comments, and Spaces.
- [x] **Sample Data**: 5+ items provided via `npm run seed`.
- [x] **Authentication**: Google OAuth implemented with session persistence.
- [x] **Validation**: Back-end validation using `express-validator`.
- [x] **DLSU Filter**: Only `@dlsu.edu.ph` emails allowed.
