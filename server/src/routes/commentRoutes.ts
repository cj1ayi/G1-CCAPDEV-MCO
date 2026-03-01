import { Router } from 'express';
import { 
  createComment, 
  getCommentsByPost, 
  deleteComment 
} from '../controllers/commentController.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Base route: /api/comments
router.post('/', ensureAuth, createComment);
router.delete('/:id', ensureAuth, deleteComment);

// Nested route: /api/comments/post/:postId
router.get('/post/:postId', getCommentsByPost);

export default router;
