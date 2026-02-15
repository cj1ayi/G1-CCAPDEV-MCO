# AnimoForums  

## About
**AnimoForums** is a Reddit-style web forum designed specifically for DLSU students.

Instead of relying on fragmented Discord servers, Messenger group chats, or Facebook groups, the platform centralizes discussions into structured, interest-based Spaces. Students can create posts, engage in threaded conversations, and interact through a voting system — all within a unified and searchable environment.

It functions as a digital tambayan built for Lasallians:
organized, searchable, and community-driven.


## Tech Stack
`React` • `Vite` • `JavaScript` • `CSS` • `ESLint`

## Members / Authors

Calupig, Evan Riley Lopez

Panganiban, Diane Benedict

Ranara, Ramil Carlos Bulaclac

Tan, Roberta Netanya Sy


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

All frontend development is handled inside the `client` folder.
## How to Run the Project

### 1. Clone the repository
```bash
git clone https://github.com/cj1ayi/G1-CCAPDEV-MCO.git
```

### 2. Go into the client folder
```bash
cd G1-CCAPDEV-MCO/client
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```


© G1 CCAPDEV MCO

