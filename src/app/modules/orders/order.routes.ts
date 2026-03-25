import { Router } from 'express';
import { orderController } from './order.controller';

const router: Router = Router();

router.get('/', orderController.getAllOrders);
router.get('/', orderController.getOrderById);
router.post('/', orderController.updateOrder);
router.put('/:id', orderController.updateOrder);

export const ordersRoutes = router;
