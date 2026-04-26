import { Router } from 'express';
import { reviewsController } from './reviews.controller';

const router: Router = Router();

router.get('/', reviewsController.getAllReviews);
router.post('/', reviewsController.createReviews);
router.patch('/', reviewsController.updateReviews);

export const reviewsRoutes = router;
