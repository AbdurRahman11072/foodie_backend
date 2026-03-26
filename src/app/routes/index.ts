import { Router } from 'express';
import { catagoryRoutes } from '../modules/catagory/catagory.routes';
import { mealRoutes } from '../modules/meals/meals.routes';
import { ordersRoutes } from '../modules/orders/order.routes';
import { restaurantRoutes } from '../modules/restaurant/restautant.route';
import { reviewsRoutes } from '../modules/reviews/reviews.routes';
import { userRoutes } from '../modules/user/user.routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/meals', mealRoutes);
router.use('/catagory', catagoryRoutes);
router.use('/orders', ordersRoutes);
router.use('/reviews', reviewsRoutes);

export const RootRoutes = router;
