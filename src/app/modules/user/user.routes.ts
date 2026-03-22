import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { userController } from './user.controller';

const router: Router = Router();

router.get('/', authMiddleware([userRole.admin]), userController.getAllUser);
router.put(
  '/:id',
  authMiddleware([userRole.admin, userRole.user, userRole.provider]),
  userController.updateUser
);

export const userRoutes = router;
