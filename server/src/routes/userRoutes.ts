import { Router } from 'express';
import { ensureAuth } from '../middleware/auth.js';

import {
  getUserById,
  getUserByUsername,
  getUsersByBadge,
  updateUser,
  getUserPosts,
  getUserComments,
  getUserSpaces,
  getUserUpvotedPosts,
} from '../controllers/userController.js';

const router = Router();

// GET /api/users/badge/:badge — fetch all users with a given badge
router.get('/badge/:badge', getUsersByBadge);

// GET /api/users/username/:username — must be before /:id to avoid conflict
router.get('/username/:username', getUserByUsername);

// GET /api/users/:id
router.get('/:id', getUserById);

// PATCH /api/users/:id
router.patch('/:id', ensureAuth, updateUser);

// GET /api/users/:id/posts
router.get('/:id/posts', getUserPosts);

// GET /api/users/:id/comments
router.get('/:id/comments', getUserComments);

// GET /api/users/:id/spaces
router.get('/:id/spaces', getUserSpaces);

// GET /api/users/:id/upvoted
router.get('/:id/upvoted', getUserUpvotedPosts);

export default router;
