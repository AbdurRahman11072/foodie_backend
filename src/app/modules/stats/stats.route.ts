import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { statsController } from './stats.controller';

const router: Router = Router();
router.get(
  '/',
  authMiddleware([userRole.admin, userRole.provider]),
  statsController.getAllStats
);

export const statsRoutes = router;
