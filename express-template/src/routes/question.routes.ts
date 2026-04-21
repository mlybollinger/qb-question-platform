import { Router } from 'express';
import * as questionController from '../controllers/question.controller';

const router = Router();

router.get('/', questionController.getAll);
router.get('/:id', questionController.getById);
router.post('/', questionController.create);
router.put('/:id', questionController.update);
router.delete('/:id', questionController.remove);

export default router;
