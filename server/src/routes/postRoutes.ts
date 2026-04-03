import { Router } from 'express';
import { ensureAuth } from '../middleware/auth.js'

import { 
  createPost, 
  getPosts, 
  getPostById, 
  deletePost,
  updatePost 
} from '../controllers/postController.js';

import {
    postValidationRules,
    postUpdateValidationRules,
    validate 
} from '../middleware/validator.js';

const router = Router();

router.route('/')
  .get(getPosts)
  .post(ensureAuth, postValidationRules, validate, createPost); 

router.route('/:id')
  .get(getPostById)
  .patch(ensureAuth, postUpdateValidationRules, validate, updatePost)
  .delete(ensureAuth, deletePost)

export default router;
