import { Router } from 'express';
import * as packetController from '../controllers/packet.controller';

const router = Router();

router.get('/', packetController.getAll);
router.get('/:id', packetController.getById);
router.post('/', packetController.create);
router.put('/:id', packetController.update);
router.delete('/:id', packetController.remove);
router.post('/:id/packetize', packetController.packetize);

export default router;
