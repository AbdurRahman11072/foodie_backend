import { Router } from 'express';
import { upload } from '../../middleware/multer';
import uploadImg from './upload.controller';

const router: Router = Router();

router.post('/', upload.single('coverImg'), uploadImg);

export const uploadRoutes = router;
