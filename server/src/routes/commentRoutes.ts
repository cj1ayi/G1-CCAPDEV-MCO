import { Router } from 'express';

import { 
  createComment, 
  getCommentsByPostId, 
  deleteComment,
  updateComment
} from '../controllers/commentController.js';

import {
    commentValidationRules,
    validate
} from '../middleware/validator.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Base route: /api/comments
router.post('/', ensureAuth, commentValidationRules, validate, createComment);
router.delete('/:id', ensureAuth, deleteComment);
router.patch('/:id', ensureAuth, updateComment)
// Nested route: /api/comments/post/:postId
router.get('/post/:postId', getCommentsByPostId);

export default router;
