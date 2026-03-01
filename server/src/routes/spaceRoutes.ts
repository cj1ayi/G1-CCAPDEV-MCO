import { Router } from 'express';
import { 
  createSpace, 
  getSpaces, 
  getSpaceByName, 
  toggleJoinSpace 
} from '../controllers/spaceController.js';

const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

router.route('/')
  .get(getSpaces)
  .post(ensureAuth, createSpace);

router.get('/:name', getSpaceByName);
router.post('/:id/toggle-join', ensureAuth, toggleJoinSpace);

export default router;
