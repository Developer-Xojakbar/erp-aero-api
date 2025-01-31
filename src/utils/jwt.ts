import jwt from 'jsonwebtoken';
import { AuthPayload } from '../const';

const JWT_ACCESS_EXPIRES_IN = '10m';
const JWT_REFRESH_EXPIRES_IN = '30d';

class JsonWebToken {
    signAccess(payload: AuthPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
            expiresIn: JWT_ACCESS_EXPIRES_IN,
        });
    }

    signRefresh(payload: Omit<AuthPayload, 'refreshToken'>): string {
        return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
        });
    }

    sign(userId: number) {
        const refreshToken = this.signRefresh({ id: userId });
        const accessToken = this.signAccess({
            id: userId,
            refreshToken,
        });

        return { accessToken, refreshToken };
    }

    verify(token: string) {
        return jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret,
        ) as AuthPayload;
    }
}

export const jsonWebToken = new JsonWebToken();
