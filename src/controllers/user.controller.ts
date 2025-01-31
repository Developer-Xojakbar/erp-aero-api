import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import { userService } from '../services';
import { EmptyParams, ResBody, ReqBody } from '../const';

class UserController {
    info = catchAsync(
        async (req: Request<EmptyParams, ResBody, ReqBody>, res: Response) => {
            const { id } = req.user;

            const { email } = await userService.info(id);

            res.status(200).json({ email });
        },
    );
}

export const userController = new UserController();
