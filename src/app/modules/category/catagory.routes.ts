import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { CategoryController } from './catagory.controller';

const router: Router = Router();

router.get(
  '/',

  CategoryController.getAllCategory
);
router.post(
  '/',
  authMiddleware([userRole.admin]),
  // upload.single('coverImg'),
  CategoryController.createCategory
);
router.put(
  '/:id',
  authMiddleware([userRole.admin]),
  CategoryController.updateCategoryInfo
);
router.delete(
  '/:id',
  authMiddleware([userRole.admin]),
  CategoryController.deleteCategory
);

export const categoryRoutes = router;
