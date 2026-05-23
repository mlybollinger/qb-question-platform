import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', userController.create);
router.get('/', requireAuth, userController.getAll);
router.get('/:id', requireAuth, userController.getById);
router.put('/:id', requireAuth, userController.update);
router.delete('/:id', requireAuth, userController.remove);

export default router;
