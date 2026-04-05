<div align="center">
  <img src=" client/src/assets/logo/AnimoForumsLogoCombined.svg" alt="AnimoForums Logo" width="600"/>
  <p>A community forum platform built exclusively for De La Salle University students.</p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-animoforums.onrender.com-046A38?style=flat-square)](https://animoforums.onrender.com/)
  [![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Local-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Dependencies](#dependencies)
5. [Live Deployment](#live-deployment)
6. [Local Setup](#local-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
7. [Test Credentials & Grading Bypass](#test-credentials--grading-bypass)
8. [Project Structure](#project-structure)
9. [Development Guidelines](#development-guidelines)
   - [Git Workflow](#git-workflow)
   - [Branch Naming Conventions](#branch-naming-conventions)
   - [Commit Message Conventions](#commit-message-conventions)
10. [License](#license)
11. [Team](#team)

---

## Overview

AnimoForums addresses the fragmentation of student communication across multiple informal platforms — Discord servers, Messenger groups, and Facebook groups — by providing a centralized, organized discussion environment tailored to the DLSU community.

Students can participate in interest-based communities called Spaces, engage in threaded discussions, vote on content, and search across the entire platform — all in one place.

---

## Features

### Discussion System
- Create posts with rich text, images, and links via a WYSIWYG editor (TipTap) with Markdown support
- Nested comment threads with unlimited depth
- Upvote and downvote system for both posts and comments
- Trending content discovery on the home feed

### Community Organization
- Interest-based Spaces with custom rules and moderation
- Space discovery, search, and directory browsing
- Join and manage multiple Spaces per user

### User Profiles
- Editable profile pages with activity history
- Per-user post and comment statistics
- Dark mode support

### Search
- Platform-wide search across posts, comments, and Spaces

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI Library |
| TypeScript | 5.x | Type-safe Development |
| Vite | 5.x | Build Tool and Dev Server |
| TailwindCSS | 3.x | Utility-first Styling |
| React Router | — | Client-side Routing |
| TipTap | — | Rich Text Editor |
| TanStack Query | — | Server State Management |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime Environment |
| Express | — | Web Framework |
| MongoDB | — | NoSQL Database |
| Mongoose | — | ODM for MongoDB |
| Passport.js | — | Authentication Middleware |

---

## Dependencies

For a full list of all npm packages and third-party libraries used in this project, refer to the application's About page:

**https://animoforums.onrender.com/about**

---

## Live Deployment

The application is deployed and accessible at:

**https://animoforums.onrender.com/**

No local setup is required to access the deployed version. Note that the initial load may take up to 30 seconds if the server has spun down due to inactivity (Render free tier behavior).

---

## Local Setup

### Prerequisites

Ensure the following are installed on your system before proceeding:

| Requirement | Version | Download |
|---|---|---|
| Node.js | v18.x or higher | https://nodejs.org/ |
| npm | v9.x or higher | Included with Node.js |
| MongoDB | Latest Community | https://www.mongodb.com/try/download/community |
| Git | Any recent version | https://git-scm.com/ |

Verify your installations:

```bash
node --version
npm --version
git --version
```

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/cj1ayi/G1-CCAPDEV-MCO.git
cd G1-CCAPDEV-MCO
```

**2. Install frontend dependencies:**

```bash
cd client
npm install
```

**3. Install backend dependencies:**

```bash
cd ../server
npm install
```

**4. Configure environment variables:**

Create a `.env` file inside the `server` directory with the following contents:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/animospaces
SESSION_SECRET=any_random_string

# Google OAuth (optional for local testing — see Grading Bypass below)
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

**5. Seed the database:**

This populates the required users, posts, spaces, and comments into your local MongoDB instance.

```bash
cd server
npm run seed
```

### Running the Application

Start the backend and frontend in two separate terminal sessions.

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

The application will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

---

## Test Credentials & Grading Bypass

Since Google OAuth requires specific API credentials and authorized redirect domains, a grading bypass has been implemented to allow full access to all features without OAuth configuration.

**Steps:**

1. Ensure both the frontend and backend servers are running.
2. Open your browser and navigate to:

```
http://localhost:3000/api/auth/grading-login
```

3. You will be automatically authenticated as the seeded user **tiamlee** and redirected to the Explore page.
4. From there, all features are accessible: creating posts, voting, joining Spaces, and editing the profile.

---

## Project Structure

```
.
├── client                          # Frontend application (React + Vite)
│   ├── src
│   │   ├── components
│   │   │   ├── layout              # Page layout wrappers (Header, Footer, Sidebars)
│   │   │   ├── shared              # Reusable skeleton loaders and state components
│   │   │   └── ui                  # Base UI primitives (Button, Input, Modal, etc.)
│   │   ├── features
│   │   │   ├── auth                # Authentication context, hooks, and services
│   │   │   ├── comments            # Comment components, hooks, and tree utilities
│   │   │   ├── explore             # Explore feed and filter components
│   │   │   ├── landing             # Landing page hero and trending carousel
│   │   │   ├── posts               # Post creation, display, voting, and detail view
│   │   │   ├── profile             # User profile components and activity feed
│   │   │   ├── search              # Search results components and service
│   │   │   ├── spaces              # Space components, hooks, and validation
│   │   │   └── votes               # Voting context and utilities
│   │   ├── hooks                   # Global hooks (dark mode, toast, loading bar)
│   │   ├── lib                     # API utilities, date formatting, query provider
│   │   └── pages                   # Top-level route pages
│   └── dist                        # Production build output
│
└── server                          # Backend application (Express + MongoDB)
    └── src
        ├── config                  # Database connection and Passport configuration
        ├── controllers             # Request handlers for each resource
        ├── middleware              # Authentication guards and request validation
        ├── models                  # Mongoose schemas (User, Post, Comment, Space, Vote)
        ├── routes                  # Express route definitions
        └── seed.ts                 # Database seeding script
```

---

## Development Guidelines

### Git Workflow

This project uses a protected branching strategy. Direct commits to `main` or `develop` are not permitted.

**Standard workflow:**

```bash
# 1. Sync your local develop branch
git checkout develop
git pull origin develop

# 2. Create a feature branch off develop
git checkout -b feature/your-feature-name

# 3. Work and commit using conventional commits (see below)

# 4. Rebase onto the latest develop before merging
git fetch origin
git rebase origin/develop

# 5a. Option A — Local merge with merge commit
git checkout develop
git merge --no-ff feature/your-feature-name
git push origin develop

# 5b. Option B — Open a Pull Request on GitHub
git push origin feature/your-feature-name
```

### Branch Naming Conventions

| Prefix | Purpose | Example |
|---|---|---|
| `main` | Production branch (stable) | `main` |
| `develop` | Integration branch for features | `develop` |
| `feature/` | New features or UI improvements | `feature/rich-text-editor` |
| `refactor/` | Code restructuring without behavior changes | `refactor/auth-logic` |
| `fix/` | Bug fixes | `fix/comment-deletion` |
| `chore/` | Maintenance or configuration updates | `chore/update-packages` |
| `documentation/` | README or wiki updates | `documentation/setup-guide` |

### Commit Message Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

| Type | Purpose | Example |
|---|---|---|
| `feat` | Add a new feature | `feat: implement TipTap editor` |
| `fix` | Fix a bug | `fix: update count on delete` |
| `refactor` | Improve code without changing behavior | `refactor: simplify auth logic` |
| `merge` | Merging branches | `merge: feature/voting into develop` |
| `perf` | Optimize performance | `perf: optimize image loading` |
| `style` | Formatting changes only | `style: fix indentation in Header` |
| `test` | Add or update tests | `test: add unit tests for voting` |
| `build` | Modify build system or configuration | `build: update vite config` |
| `docs` | Update documentation | `docs: update setup instructions` |
| `chore` | Non-code maintenance | `chore: bump dependencies` |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Team

**G1 — CCAPDEV MCO**  
De La Salle University — Computer Concepts and Application Development

| Name | GitHub |
|---|---|
| Calupig, Evan Riley Lopez | [@yaraikun](https://github.com/yaraikun) |
| Panganiban, Diane Benedict | [@Teeheene](https://github.com/Teeheene) |
| Ranara, Ramil Carlos Bulaclac | [@Floranaras](https://github.com/Floranaras) |
| Tan, Roberta Netanya Sy | [@cj1ayi](https://github.com/cj1ayi) |
