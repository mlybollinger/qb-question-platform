import { Router } from 'express';
import * as tournamentController from '../controllers/tournament.controller';

const router = Router();

router.get('/', tournamentController.getAll);
router.get('/:id', tournamentController.getById);
router.post('/', tournamentController.create);
router.put('/:id', tournamentController.update);
router.delete('/:id', tournamentController.remove);

export default router;
