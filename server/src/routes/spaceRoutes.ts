import { Router } from 'express';

import { 
  createSpace, 
  getSpaces, 
  getSpaceByName, 
  toggleJoinSpace,
  deleteSpace,
  updateSpace
} from '../controllers/spaceController.js';

import {
    spaceValidationRules,
    validate
} from '../middleware/validator.js';


const router = Router();

const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

router.route('/')
  .get(getSpaces)
  .post(ensureAuth, spaceValidationRules, validate, createSpace);

router.get('/:name', getSpaceByName);
router.post('/:id/toggle-join', ensureAuth, toggleJoinSpace);
router.delete('/:id', ensureAuth, deleteSpace)
router.route('/:id')
  .patch(ensureAuth, updateSpace)
  .delete(ensureAuth, deleteSpace)

export default router;
