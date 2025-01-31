import { prisma } from '../prisma';
import { bcrypt, jsonWebToken } from '../utils';
import {
    AuthPayload,
    SigninNewTokenRequestBody,
    SigninRequestBody,
    AuthServiceLogout,
} from '../const';

class AuthService {
    async createToken({ id, refreshToken }: AuthPayload) {
        await prisma.token.create({
            data: {
                refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                userId: id,
            },
        });
    }

    async signup({ email, password }: SigninRequestBody) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const { accessToken, refreshToken } = jsonWebToken.sign(user.id);

        await this.createToken({ id: user.id, refreshToken });

        return { accessToken, refreshToken };
    }

    async signin({ email, password }: SigninRequestBody) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid password');

        const { accessToken, refreshToken } = jsonWebToken.sign(user.id);

        await this.createToken({ id: user.id, refreshToken });

        return { accessToken, refreshToken };
    }

    async signinNewToken({ refreshToken }: SigninNewTokenRequestBody) {
        const decoded = jsonWebToken.verify(refreshToken);

        if (!decoded) throw new Error('Invalid refresh token');

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) throw new Error('User not found');

        const accessToken = jsonWebToken.signAccess({
            id: user.id,
            refreshToken,
        });

        return { accessToken };
    }

    async logout({ refreshToken }: AuthServiceLogout) {
        await prisma.token.delete({
            where: {
                refreshToken,
            },
        });
    }
}

export const authService = new AuthService();
