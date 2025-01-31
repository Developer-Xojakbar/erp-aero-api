import { prisma } from '../prisma';
import { CustomError } from '../utils';

class UserService {
    async verifyRefreshToken(id: number, refreshToken: string) {
        return prisma.token.findUnique({
            where: { userId: id, refreshToken },
        });
    }

    async info(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { email: true },
        });

        if (!user) {
            throw new CustomError('User does not exist', 404);
        }

        return user;
    }
}

export const userService = new UserService();
