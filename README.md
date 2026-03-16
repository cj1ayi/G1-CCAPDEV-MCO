# AnimoForums

A Reddit-style web forum platform designed specifically for DLSU students to 
centralize campus discussions in a unified, searchable environment.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Development](#development)
  - [Git Workflow](#git-workflow)
  - [Coding Standards](#coding-standards)
- [License](#license)
- [Team](#team)

## Overview

AnimoForums addresses the fragmentation of student communication across multiple 
platforms (Discord servers, Messenger groups, Facebook groups) by providing a 
centralized, organized discussion platform. The application features 
interest-based Spaces, threaded conversations, a voting system, and 
comprehensive search functionality.

**Key Benefits:**
- Centralized campus discussions in one platform
- Organized, topic-based communities (Spaces)
- Persistent, searchable conversation history
- Community-curated content through voting
- Structured threaded discussions

## Features

### Discussion System
- Create and share posts with text, images, and links
- **Rich Text Editor:** WYSIWYG editing with Markdown support (TipTap)
- Nested comment threads with unlimited depth
- Upvote/downvote system for posts and comments
- Real-time trending content discovery

### Community Organization
- Interest-based Spaces (communities)
- Space discovery and search
- Custom space rules and moderation

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19.x | UI Library |
| TypeScript | Type-safe Development |
| Vite | Build Tool & Dev Server |
| TailwindCSS | Utility-first Styling |
| React Router | Client-side Routing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express | Web Framework |
| MongoDB | NoSQL Database |
| Mongoose | ODM for MongoDB |
| Passport.js | Authentication Middleware |

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (included with Node.js)
- **MongoDB** (Local instance) ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))

Verify installations:

```bash
node --version
npm --version
git --version
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cj1ayi/G1-CCAPDEV-MCO.git
cd G1-CCAPDEV-MCO
```

2. Install frontend dependencies:

```bash
cd client
npm install
```

3. For backend setup and database seeding, follow the steps in the 
[server README](server/README.md).

### Running the Application

1. Start the backend server:

```bash
cd server
npm run dev
```

2. In a separate terminal, start the frontend:

```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

> For login instructions and test credentials, see the 
[server README](server/README.md).

## Project Structure

```
.
├── client
│   ├── eslint.config.mjs
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.ts
│   ├── README.md
│   ├── src
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   ├── homeImage
│   │   │   │   └── LSHall.png
│   │   │   ├── loginpics
│   │   │   │   ├── DoroteoJose.png
│   │   │   │   ├── henrychairs.jpg
│   │   │   │   ├── legendsyuch.jpg
│   │   │   │   ├── lssunrise.png
│   │   │   │   ├── StMigs.jpg
│   │   │   │   ├── sundownhenry.jpg
│   │   │   │   ├── sunerisehenry.jpg
│   │   │   │   ├── sunrisestmig.jpg
│   │   │   │   └── YuchHall.png
│   │   │   ├── logo
│   │   │   │   ├── AnimoForumsLogoCombined.svg
│   │   │   │   ├── AnimoForumsLogoHat.svg
│   │   │   │   └── AnimoForumsLogoWhite.svg
│   │   │   ├── pfp
│   │   │   │   ├── callo.png
│   │   │   │   ├── default.png
│   │   │   │   ├── diane.png
│   │   │   │   ├── enzo.gif
│   │   │   │   ├── gabb.png
│   │   │   │   ├── karl.png
│   │   │   │   ├── pring.gif
│   │   │   │   └── tiamlee.png
│   │   │   └── post
│   │   │       ├── car.jpg
│   │   │       └── shark.jpg
│   │   ├── components
│   │   │   ├── layout
│   │   │   │   ├── DefaultLeftSidebar.tsx
│   │   │   │   ├── DefaultRightSidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── MainLayout.tsx
│   │   │   ├── shared
│   │   │   │   ├── CommentSkeleton.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   ├── FeedSkeleton.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── LoadingBar.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── PostCardSkeleton.tsx
│   │   │   │   ├── PostDetailSkeleton.tsx
│   │   │   │   ├── ProfileHeaderSkeleton.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── SpaceCardSkeleton.tsx
│   │   │   │   └── Spaceheaderskeleton.tsx
│   │   │   └── ui
│   │   │       ├── Avatar.tsx
│   │   │       ├── AvatarDropdown.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Checkbox.tsx
│   │   │       ├── ConfirmDeleteModal.tsx
│   │   │       ├── Dropdown.tsx
│   │   │       ├── index.ts
│   │   │       ├── Input.tsx
│   │   │       ├── MarkdownToolbar.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── PasswordInput.tsx
│   │   │       ├── RichTextEditor.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── Textarea.tsx
│   │   │       ├── Toast.tsx
│   │   │       └── VoteButtons.tsx
│   │   ├── features
│   │   │   ├── auth
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── useAuth.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── authService.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── comments
│   │   │   │   ├── components
│   │   │   │   │   ├── CommentCard
│   │   │   │   │   │   ├── CommentActions.tsx
│   │   │   │   │   │   ├── CommentCard.tsx
│   │   │   │   │   │   ├── CommentContent.tsx
│   │   │   │   │   │   ├── CommentHeader.tsx
│   │   │   │   │   │   ├── CommentMenu.tsx
│   │   │   │   │   │   ├── CommentReplyForm.tsx
│   │   │   │   │   │   ├── CommentVoting.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── types.ts
│   │   │   │   │   ├── CommentInput.tsx
│   │   │   │   │   ├── CommentSection.tsx
│   │   │   │   │   ├── DeleteCommentModal.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── useComments.ts
│   │   │   │   │   └── useCommentVoting.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── commentService.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── utils
│   │   │   │       ├── comment-tree-builder.ts
│   │   │   │       ├── comment-utils.ts
│   │   │   │       └── seedComments.ts
│   │   │   ├── explore
│   │   │   │   ├── components
│   │   │   │   │   ├── Feed.tsx
│   │   │   │   │   ├── Filter.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── landing
│   │   │   │   ├── components
│   │   │   │   │   ├── CarouselCard.tsx
│   │   │   │   │   ├── Hero.tsx
│   │   │   │   │   ├── HeroPostCard.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── Stats.tsx
│   │   │   │   │   └── TrendingCarousel.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── useStats.ts
│   │   │   │   │   ├── useThumbnails.ts
│   │   │   │   │   └── useTrendingPosts.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── utils
│   │   │   │       └── imageUtils.ts
│   │   │   ├── navigation
│   │   │   │   └── components
│   │   │   │       ├── index.ts
│   │   │   │       └── SidebarNav.tsx
│   │   │   ├── posts
│   │   │   │   ├── components
│   │   │   │   │   ├── CreatePostForm.tsx
│   │   │   │   │   ├── DeletePostModal.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── PostAction.tsx
│   │   │   │   │   ├── PostCard
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   │   ├── PostCardContent.tsx
│   │   │   │   │   │   ├── PostCardHeader.tsx
│   │   │   │   │   │   ├── PostCardVoting.tsx
│   │   │   │   │   │   └── types.ts
│   │   │   │   │   ├── PostDetailActions.tsx
│   │   │   │   │   ├── PostDetailBreadcrumbs.tsx
│   │   │   │   │   ├── PostDetailContent.tsx
│   │   │   │   │   ├── PostDetailHeader.tsx
│   │   │   │   │   ├── PostDetailVoteColumn.tsx
│   │   │   │   │   ├── PostForm.tsx
│   │   │   │   │   ├── PostImage.tsx
│   │   │   │   │   └── TrendingWidget.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── useCreatePost.ts
│   │   │   │   │   ├── usePostDetail.ts
│   │   │   │   │   ├── usePostDetailView.ts
│   │   │   │   │   └── useVoting.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── postService.ts
│   │   │   │   └── types.ts
│   │   │   ├── profile
│   │   │   │   ├── components
│   │   │   │   │   ├── AboutWidget.tsx
│   │   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── PostPreviewCard.tsx
│   │   │   │   │   ├── ProfileActivity.tsx
│   │   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   │   ├── ProfileNavbar.tsx
│   │   │   │   │   ├── ProfilePostsList.tsx
│   │   │   │   │   ├── ProfileSidebar.tsx
│   │   │   │   │   ├── SpacesWidget.tsx
│   │   │   │   │   └── StatsWidget.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── useProfileView.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── userService.ts
│   │   │   │   └── types.ts
│   │   │   ├── search
│   │   │   │   └── components
│   │   │   │       ├── index.ts
│   │   │   │       └── SearchResults.tsx
│   │   │   ├── spaces
│   │   │   │   ├── components
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── rules
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── RuleEditor.tsx
│   │   │   │   │   │   ├── RulesList.tsx
│   │   │   │   │   │   └── RulesWidget.tsx
│   │   │   │   │   ├── SpaceAboutWidget.tsx
│   │   │   │   │   ├── SpaceCard.tsx
│   │   │   │   │   ├── SpaceDeleteModal.tsx
│   │   │   │   │   ├── SpaceDirectoryHeader.tsx
│   │   │   │   │   ├── SpaceEmptyState.tsx
│   │   │   │   │   ├── SpaceFilters.tsx
│   │   │   │   │   ├── SpaceForm.tsx
│   │   │   │   │   ├── SpaceHeader.tsx
│   │   │   │   │   ├── SpaceSortBar.tsx
│   │   │   │   │   └── YourSpacesWidget.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── useCreateSpace.ts
│   │   │   │   │   ├── useDeleteSpace.ts
│   │   │   │   │   ├── useEditSpace.ts
│   │   │   │   │   ├── useSpacePage.ts
│   │   │   │   │   └── useSpaces.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── spaceService.ts
│   │   │   │   └── utils
│   │   │   │       ├── index.ts
│   │   │   │       ├── spaceHelpers.ts
│   │   │   │       └── spaceValidation.ts
│   │   │   └── votes
│   │   │       ├── services
│   │   │       │   └── voteService.ts
│   │   │       ├── types.ts
│   │   │       └── VotingContext.tsx
│   │   ├── hooks
│   │   │   ├── index.ts
│   │   │   ├── ToastContext.tsx
│   │   │   ├── useDarkMode.ts
│   │   │   ├── useImageRotation.ts
│   │   │   ├── useLoadingBar.ts
│   │   │   ├── usePasswordStrength.ts
│   │   │   └── useToast.ts
│   │   ├── index.css
│   │   ├── lib
│   │   │   ├── apiUtils.ts
│   │   │   ├── dateUtils.ts
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── CreatePost.tsx
│   │   │   ├── CreateSpace.tsx
│   │   │   ├── EditPost.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   ├── EditSpace.tsx
│   │   │   ├── Explore.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── index.ts
│   │   │   ├── Login.tsx
│   │   │   ├── PostDetail.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Space.tsx
│   │   │   └── SpacesDirectory.tsx
│   │   └── vite-env.d.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── server
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── src
    │   ├── app.ts
    │   ├── config
    │   │   ├── db.ts
    │   │   └── passport.ts
    │   ├── controllers
    │   │   ├── commentController.ts
    │   │   ├── postController.ts
    │   │   ├── spaceController.ts
    │   │   ├── statsController.ts
    │   │   ├── userController.ts
    │   │   └── voteController.ts
    │   ├── index.ts
    │   ├── middleware
    │   │   └── validator.ts
    │   ├── models
    │   │   ├── Comment.ts
    │   │   ├── Post.ts
    │   │   ├── Space.ts
    │   │   ├── User.ts
    │   │   └── Vote.ts
    │   ├── routes
    │   │   ├── authRoutes.ts
    │   │   ├── commentRoutes.ts
    │   │   ├── postRoutes.ts
    │   │   ├── spaceRoutes.ts
    │   │   ├── statsRoutes.ts
    │   │   ├── userRoutes.ts
    │   │   └── voteRoutes.ts
    │   ├── seed.ts
    │   └── types
    └── tsconfig.json
```

## Development

### Git Workflow

We use a strict branching strategy to ensure stability. **Never commit directly 
to `main` or `develop`.**

1.  **Update Local Develop:** Always start by ensuring your local `develop` 
    branch is up to date.
    ```bash
    git checkout develop
    git pull origin develop
    ```

2.  **Create a Branch:** Always branch off of `develop`. Avoid branching off 
    other feature or refactor branches.
    ```bash
    git checkout -b feature/your-feature-name
    ```

3.  **Work and Commit:** Follow the [Coding Standards](#coding-standards) for 
    commit messages.

4.  **Final Sync (Sanity Tip):** Before merging, pull the latest `develop` and 
    rebase your branch onto it one last time to ensure a clean history.
    ```bash
    git fetch origin
    git rebase origin/develop
    ```

5.  **Merge and Push:** You have two options to integrate your changes into 
    `develop`:

    - **Option A: Local Merge (Manual Flow)**
      Switch to `develop` and merge using the `--no-ff` flag. This ensures a 
      merge commit is created, documenting the integration.
      ```bash
      git checkout develop
      git merge --no-ff feature/your-feature-name
      git push origin develop
      ```

    - **Option B: Pull Request (GitHub Flow)**
      Push your branch to remote and open a Pull Request against `develop` on 
      GitHub.
      ```bash
      git push origin feature/your-feature-name
      ```

### Branch Naming Conventions

| Branch Type | Purpose | Sample Branch Name |
|:---|:---|:---|
| **`main`** | Production branch (stable code) | `main` |
| **`develop`** | Integration branch for features | `develop` |
| **`feature/`** | New features or UI improvements | `feature/rich-text-editor` |
| **`refactor/`** | Code restructuring without changing behavior | `refactor/auth-logic` |
| **`fix/`** | Bug fixes | `fix/comment-deletion` |
| **`chore/`** | Maintenance or configuration | `chore/update-packages` |
| **`documentation/`** | README or wiki updates | `documentation/setup-guide` |

### Coding Standards

#### Conventional Commit Types

| Type | Purpose | Sample Commit Message |
|:---|:---|:---|
| **`feat`** | Add a new feature | `feat: implement TipTap editor` |
| **`fix`** | Fix a bug | `fix: update count on delete` |
| **`refactor`** | Improve code without changing behavior | `refactor: simplify auth logic` |
| **`merge`** | Merging branches | `merge: feature/voting into develop` |
| **`perf`** | Optimize performance | `perf: optimize image loading` |
| **`style`** | Formatting changes (indentation, etc.) | `style: fix indentation in Header` |
| **`test`** | Add or update test cases | `test: add unit tests for voting` |
| **`build`** | Modify build system or config | `build: update vite config` |
| **`docs`** | Update README, specs, or comments | `docs: update setup instructions` |
| **`chore`** | Non-code maintenance | `chore: bump dependencies` |

> [See conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file 
for details.

## Team

**G1 CCAPDEV MCO**

| Name | GitHub |
|------|--------|
| Calupig, Evan Riley Lopez | [@yaraikun](https://github.com/yaraikun) |
| Panganiban, Diane Benedict | [@Teehee](https://github.com/Teeheene) |
| Ranara, Ramil Carlos Bulaclac | [@Floranaras](https://github.com/Floranaras) |
| Tan, Roberta Netanya Sy | [@cj1ayi](https://github.com/cj1ayi) |

---

**De La Salle University**  
Computer Concepts and Application Development (CCAPDEV)

© G1 CCAPDEV MCO
