import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { restaurantController } from './restautant.controller';

const router: Router = Router();
router.get('/', restaurantController.getAllRestaurant);
router.get('/featured-restaurants', restaurantController.featuredRestaurant);
router.get('/:id', restaurantController.getRestaurantById);
router.post(
  '/',
  authMiddleware([userRole.user, userRole.admin]),
  restaurantController.createRestaurant
);
router.put(
  '/:id',
  authMiddleware([userRole.provider, userRole.admin]),
  restaurantController.updateRestaurantInfo
);

export const restaurantRoutes = router;
