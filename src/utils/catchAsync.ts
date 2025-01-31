/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const withRetry = async (fn: () => void, retries = 3, delay = 2000) => {
    let attempt = 0;

    while (attempt < retries) {
        try {
            return await fn();
        } catch (err) {
            const isConnectionTimedOutError =
                err instanceof PrismaClientKnownRequestError &&
                err.message.includes('Connection timed out');

            if (!isConnectionTimedOutError) {
                throw err;
            }

            attempt++;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error(
        'Failed to connect to the database after multiple attempts.',
    );
};

export const catchAsync = <
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query,
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction,
    ) => Promise<void> | void,
) => {
    return async (
        req: Request<Partial<P>, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction,
    ) => {
        try {
            await withRetry(() => {
                return fn(
                    req as Request<P, ResBody, ReqBody, ReqQuery>,
                    res,
                    next,
                );
            });
        } catch (error) {
            next(error);
        }
    };
};
