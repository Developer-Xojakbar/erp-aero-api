import { Router } from 'express';
import { auth } from '../middlewares';
import { userController } from '../controllers';

const userRouter = Router();

userRouter.get('/info', auth.authenticate, userController.info);

export { userRouter };
