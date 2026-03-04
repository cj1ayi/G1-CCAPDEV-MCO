import { Router } from 'express';
import {
  getUserById,
  getUserByUsername,
  updateUser
} from '../controllers/userController.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// GET /api/users/:id
router.get('/:id', getUserById);

// GET /api/users/username/:username
router.get('/username/:username', getUserByUsername);

// PATCH /api/users/:id
router.patch('/:id', ensureAuth, updateUser);

export default router;
