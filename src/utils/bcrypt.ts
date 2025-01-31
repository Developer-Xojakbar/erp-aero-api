import bcryptjs from 'bcryptjs';

class Bcrypt {
    async hash(password: string, saltRounds: number): Promise<string> {
        return bcryptjs.hash(password, saltRounds);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcryptjs.compare(password, hash);
    }
}

export const bcrypt = new Bcrypt();
