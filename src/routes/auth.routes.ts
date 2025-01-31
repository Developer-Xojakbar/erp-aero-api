import { Router } from 'express';
import { auth } from '../middlewares';
import { authController } from '../controllers';

const authRouter = Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/signin', authController.signin);
authRouter.post('/signin/new_token', authController.signinNewToken);
authRouter.get('/logout', auth.authenticate, authController.logout);

export { authRouter };
