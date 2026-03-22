import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';

const router: Router = Router();

router.use('/users', userRoutes);

export const RootRoutes = router;
