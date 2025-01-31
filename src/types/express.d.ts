import { RequestUser } from '../const';

declare module 'express-serve-static-core' {
    interface Request {
        user: RequestUser;
    }
}
