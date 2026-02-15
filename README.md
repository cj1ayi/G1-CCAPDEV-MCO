# AnimoForums

A Reddit-style web forum platform designed specifically for DLSU students to centralize campus discussions in a unified, searchable environment.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
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
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)

## Overview

AnimoForums addresses the fragmentation of student communication across multiple platforms (Discord servers, Messenger groups, Facebook groups) by providing a centralized, organized discussion platform. The application features interest-based Spaces, threaded conversations, a voting system, and comprehensive search functionality.

**Key Benefits:**
- Centralized campus discussions in one platform
- Organized, topic-based communities (Spaces)
- Persistent, searchable conversation history
- Community-curated content through voting
- Structured threaded discussions

## Features

### Discussion System
- Create and share posts with text, images, and links
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
| React 18.x | UI library |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| TailwindCSS | Utility-first styling |
| React Router | Client-side routing |

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (included with Node.js)
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

3. Install backend dependencies:

```bash
cd ../server
npm install
```

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

## Logging In

> Our mock data are all based on real life conversations and events our team has
experienced. The data will range from inside jokes, reference to some events, and 
interactions with people in our academic lives. The mock users are real people
we have interacted with and have given us permission to feature them here whether
by an alias or their real name.

**For the purpose of simplifying the debugging process we opted that our mock users'
passcode be their own username. The team plans to address this security 
vulnerability in MCO2 when we have a real backend.**

### Users
| Name | Username |
|------|--------|
|  Thomas James C. Tiam-Lee | tiamlee |
|  Teehee | iloveapex |
|  Sussus Amogus | pieisspy |
|  Floranaras | callo |
|  Pringles | whotftakesthenamezex | 
|  Enzo | taroramen |

## Project Structure

```
G1-CCAPDEV-MCO
├── client
│   ├── src
│   │   ├── assets
│   │   │   ├── loginpics
│   │   │   │   ├── legendsyuch.jpg
│   │   │   │   ├── sundownhenry.jpg
│   │   │   │   ├── sunerisehenry.jpg
│   │   │   │   └── sunrisestmig.jpg
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
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   └── ui
│   │   │       ├── Avatar.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Checkbox.tsx
│   │   │       ├── Dropdown.tsx
│   │   │       ├── index.ts
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── PasswordInput.tsx
│   │   │       ├── Select.tsx
│   │   │       └── Textarea.tsx
│   │   ├── features
│   │   │   ├── auth
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── useAuth.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── authService.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── types.ts
│   │   │   ├── comments
│   │   │   │   ├── components
│   │   │   │   │   ├── CommentCard.tsx
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
│   │   │   │   ├── utils
│   │   │   │   │   ├── comment-utils.ts
│   │   │   │   │   └── seedComments.ts
│   │   │   │   └── types.ts
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
│   │   │   │   │   ├── useThumbnails.ts
│   │   │   │   │   └── useTrendingPosts.ts
│   │   │   │   ├── utils
│   │   │   │   │   └── imageUtils.ts
│   │   │   │   └── types.ts
│   │   │   ├── navigation
│   │   │   │   └── components
│   │   │   │       ├── index.ts
│   │   │   │       └── SidebarNav.tsx
│   │   │   ├── posts
│   │   │   │   ├── components
│   │   │   │   │   ├── DeletePostModal.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   ├── PostDetailActions.tsx
│   │   │   │   │   ├── PostDetailBreadcrumbs.tsx
│   │   │   │   │   ├── PostDetailContent.tsx
│   │   │   │   │   ├── PostDetailHeader.tsx
│   │   │   │   │   ├── PostDetailVoteColumn.tsx
│   │   │   │   │   ├── PostForm.tsx
│   │   │   │   │   └── TrendingWidget.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── index.ts
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
│   │   │   │   │   ├── ProfileLoadingState.tsx
│   │   │   │   │   ├── ProfileNavbar.tsx
│   │   │   │   │   ├── ProfileNotFound.tsx
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
│   │   │   │       ├── SearchResults.tsx
│   │   │   │       └── TrendingWidgets.tsx
│   │   │   └── spaces
│   │   │       ├── components
│   │   │       │   ├── CreateSpaceCard.tsx
│   │   │       │   ├── index.ts
│   │   │       │   ├── RulesWidget.tsx
│   │   │       │   ├── SpaceAboutWidget.tsx
│   │   │       │   ├── SpaceCard.tsx
│   │   │       │   ├── SpaceDirectoryHeader.tsx
│   │   │       │   ├── SpaceEmptyState.tsx
│   │   │       │   ├── SpaceFilters.tsx
│   │   │       │   ├── SpaceForm.tsx
│   │   │       │   ├── SpaceHeader.tsx
│   │   │       │   ├── SpaceSortBar.tsx
│   │   │       │   └── YourSpacesWidget.tsx
│   │   │       ├── hooks
│   │   │       │   ├── index.ts
│   │   │       │   ├── useCreateSpace.ts
│   │   │       │   ├── useSpacePage.ts
│   │   │       │   └── useSpaces.ts
│   │   │       ├── services
│   │   │       │   ├── index.ts
│   │   │       │   └── spaceService.ts
│   │   │       ├── data.ts
│   │   │       └── types.ts
│   │   ├── hooks
│   │   │   ├── index.ts
│   │   │   ├── useDarkMode.ts
│   │   │   ├── useImageRotation.ts
│   │   │   └── usePasswordStrength.ts
│   │   ├── lib
│   │   │   ├── mockData.ts
│   │   │   └── utils.ts
│   │   ├── pages
│   │   │   ├── CreatePost.tsx
│   │   │   ├── CreateSpace.tsx
│   │   │   ├── EditPost.tsx
│   │   │   ├── EditProfile.tsx
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
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── eslint.config.mjs
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.ts
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── server
│   ├── src
│   │   └── server.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── package-lock.json
├── package.json
└── README.md
```

## Development

### Git Workflow

1. Create a feature branch:
```bash
git checkout -b feature/feature-name
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: add feature description"
```

3. Push to remote:
```bash
git push origin feature/feature-name
```

4. Open a Pull Request on GitHub

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)

### Conventional Commit Types

| **Type**       | **Purpose** |
|----------------|-------------|
| **`feat`**     | Add a new feature (functions, logic) |
| **`fix`**      | Fix a bug (incorrect output, logic errors) |
| **`refactor`** | Improve code without changing behavior |
| **`perf`**     | Optimize performance (faster loops, better memory usage) |
| **`style`**    | Formatting changes (indentation, comments) |
| **`test`**     | Add or update test cases |
| **`build`**    | Modify Makefile or compilation setup |
| **`docs`**     | Update README, specs, or comments |
| **`chore`**    | Non-code maintenance (renaming files, updating `.gitignore`) |

> [See conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

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
