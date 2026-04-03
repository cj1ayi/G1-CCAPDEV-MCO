import { Router } from 'express';
import { ensureAuth } from '../middleware/auth.js';

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

router.route('/')
  .get(getSpaces)
  .post(ensureAuth, spaceValidationRules, validate, createSpace);

router.get('/:name', getSpaceByName);
router.post('/:id/toggle-join', ensureAuth, toggleJoinSpace);
router.route('/:id')
  .patch(ensureAuth, updateSpace)
  .delete(ensureAuth, deleteSpace)

export default router;
