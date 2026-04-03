import { Router } from 'express';
import { toggleVote, getUserVotes } from '../controllers/voteController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', ensureAuth, toggleVote);
router.get('/me', ensureAuth, getUserVotes);

export default router;
