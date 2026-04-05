import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { mealsController } from './meals.controller';

const router: Router = Router();

router.get('/', mealsController.getAllMeals);
router.get('/:id', mealsController.getMealsById);
router.get('/restaurant/:id', mealsController.getMealsByRestaurantId);
router.post(
  '/',
  authMiddleware([userRole.admin, userRole.provider]),
  mealsController.createMeals
);
router.put('/:id', mealsController.updateMealsInfo);

export const mealRoutes = router;
