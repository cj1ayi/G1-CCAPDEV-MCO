import { Router } from 'express';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  deletePost 
} from '../controllers/postController.js';
import { postValidationRules, validate } from '../middleware/validator.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Please log in first' });
};

router.route('/')
  .get(getPosts)
  .post(ensureAuth, postValidationRules, validate, createPost); 

router.route('/:id')
  .get(getPostById)
  .delete(ensureAuth, deletePost);

export default router;
