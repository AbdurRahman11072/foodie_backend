import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { catagoryController } from './catagory.controller';

const router: Router = Router();

router.get(
  '/',
  authMiddleware([userRole.admin]),
  catagoryController.getAllCatagory
);
router.post(
  '/',
  authMiddleware([userRole.admin]),
  catagoryController.createCatagory
);
router.put(
  '/:id',
  authMiddleware([userRole.admin]),
  catagoryController.updateCatagoryInfo
);
router.delete(
  '/:id',
  authMiddleware([userRole.admin]),
  catagoryController.deleteCatagory
);

export const catagoryRoutes = router;
