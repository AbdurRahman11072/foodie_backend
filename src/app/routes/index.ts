import { Router } from 'express';
import { categoryRoutes } from '../modules/category/catagory.routes';
import { mealRoutes } from '../modules/meals/meals.routes';
import { ordersRoutes } from '../modules/orders/order.routes';
import { restaurantRoutes } from '../modules/restaurant/restautant.route';
import { reviewsRoutes } from '../modules/reviews/reviews.routes';
import { statsRoutes } from '../modules/stats/stats.route';
import { uploadRoutes } from '../modules/uploadImage/upload.route';
import { userRoutes } from '../modules/user/user.routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/meals', mealRoutes);
router.use('/category', categoryRoutes);
router.use('/orders', ordersRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/upload-image', uploadRoutes);
router.use('/stats', statsRoutes);

export const RootRoutes = router;
