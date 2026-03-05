import { Router } from 'express';
import {
  getUserById,
  getUserByUsername,
  updateUser,
  getUserPosts,
  getUserComments,
  getUserSpaces,
  getUserUpvotedPosts,
} from '../controllers/userController.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// GET /api/users/username/:username  — must be before /:id to avoid conflict
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
