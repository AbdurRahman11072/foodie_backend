import { Router } from 'express';
import { mealRoutes } from '../modules/meals/meals.routes';
import { restaurantRoutes } from '../modules/restaurant/restautant.route';
import { userRoutes } from '../modules/user/user.routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/meals', mealRoutes);

export const RootRoutes = router;
