import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import { authService } from '../services';
import {
    EmptyParams,
    ResBody,
    ReqBody,
    SignupRequestBody,
    SigninRequestBody,
    SigninNewTokenRequestBody,
} from '../const';

class AuthController {
    signup = catchAsync(
        async (
            req: Request<EmptyParams, ResBody, SignupRequestBody>,
            res: Response,
        ) => {
            const { email, password } = req.body;

            const { accessToken, refreshToken } = await authService.signup({
                email,
                password,
            });

            res.status(200).json({ accessToken, refreshToken });
        },
    );

    signin = catchAsync(
        async (
            req: Request<EmptyParams, ResBody, SigninRequestBody>,
            res: Response,
        ) => {
            const { email, password } = req.body;

            const { accessToken, refreshToken } = await authService.signin({
                email,
                password,
            });

            res.status(200).json({ accessToken, refreshToken });
        },
    );

    signinNewToken = catchAsync(
        async (
            req: Request<EmptyParams, ResBody, SigninNewTokenRequestBody>,
            res: Response,
        ) => {
            const { refreshToken } = req.body;

            const { accessToken } = await authService.signinNewToken({
                refreshToken,
            });

            res.status(200).json({
                accessToken,
            });
        },
    );

    logout = catchAsync(
        async (req: Request<EmptyParams, ResBody, ReqBody>, res: Response) => {
            const { refreshToken } = req.user;

            await authService.logout({ refreshToken });

            res.status(200).json({ message: 'Logged out successfully' });
        },
    );
}

export const authController = new AuthController();
