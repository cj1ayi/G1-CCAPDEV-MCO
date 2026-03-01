import { Router } from 'express';
import { toggleVote, getUserVotes } from '../controllers/voteController.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

router.post('/', ensureAuth, toggleVote);
router.get('/me', ensureAuth, getUserVotes);

export default router;
