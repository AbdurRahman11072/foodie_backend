import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { restaurantController } from './restautant.controller';

const router: Router = Router();

router.post(
  '/',
  authMiddleware([userRole.user, userRole.admin]),
  restaurantController.createRestaurant
);

export const restaurantRoutes = router;
