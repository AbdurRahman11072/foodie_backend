import { Router } from 'express';
import { restaurantRoutes } from '../modules/restaurant/restautant.route';
import { userRoutes } from '../modules/user/user.routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);

export const RootRoutes = router;
