import { Router } from 'express';
import userRole from '../../constant';
import authMiddleware from '../../middleware/authMiddleware';
import { orderController } from './order.controller';

const router: Router = Router();

router.get('/', authMiddleware([userRole.admin]), orderController.getAllOrders);
router.get('/order-id/:id', orderController.getOrderById);
router.get('/:userId', orderController.getOrderByUserId);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.put('/cancel-order/:id', orderController.cancelOrder);
router.put('/update-order-items/:id', orderController.cancelOrderItems);

export const ordersRoutes = router;
