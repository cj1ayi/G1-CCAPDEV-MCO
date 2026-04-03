import { Router } from 'express';
import { ensureAuth } from '../middleware/auth.js';

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

// Base route: /api/comments
router.post('/', ensureAuth, commentValidationRules, validate, createComment);
router.delete('/:id', ensureAuth, deleteComment);
router.patch('/:id', ensureAuth, updateComment)
// Nested route: /api/comments/post/:postId
router.get('/post/:postId', getCommentsByPostId);

export default router;
