import { NextFunction, Response, Request } from 'express';
import { CustomError, jsonWebToken, catchAsync } from '../utils';
import { userService } from '../services';

class Auth {
    authenticate = catchAsync(
        async (req: Request, _: Response, next: NextFunction) => {
            const authHeader = req.headers.authorization;

            let accessToken;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.split(' ')[1];
            }

            if (!accessToken) {
                throw new CustomError('Access Token does not exist', 401);
            }

            const decoded = jsonWebToken.verify(accessToken);
            /*      я тут ничего не пропустил?
                    например это внизу 

                - Токен создавать при каждой авторизации, действителен 10 минут. Продлевать по истечению, с помощью refresh токена;
                
                я не должен автоматически обнавлять (accessToken) если срок истек?
                */

            const token = await userService.verifyRefreshToken(
                decoded.id,
                decoded.refreshToken,
            );

            if (!token) {
                throw new CustomError(`Refresh Token does not exist`, 401);
            }

            req.user = {
                id: decoded.id,
                refreshToken: decoded.refreshToken,
            };

            next();
        },
    );
}

export const auth = new Auth();
