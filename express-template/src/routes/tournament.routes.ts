import { Router } from 'express';
import * as tournamentController from '../controllers/tournament.controller';

const router = Router();

router.get('/', tournamentController.getAll);
router.get('/:id', tournamentController.getById);
router.get('/:id/questionCounts', tournamentController.getQuestionCounts);
router.post('/', tournamentController.create);
router.put('/:id', tournamentController.update);
router.delete('/:id', tournamentController.remove);
router.get('/:id/categoryTree', tournamentController.getCategoryTree)
router.get('/:id/categories', tournamentController.getCategories);
router.get('/:id/distro', tournamentController.getDistro);
export default router;
