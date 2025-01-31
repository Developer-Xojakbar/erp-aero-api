import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CustomError } from './customError';
import { ErrorResponse } from '../const';

export class GlobalErrorHandler {
    static handle(
        err: CustomError | PrismaClientKnownRequestError,
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const success = false;
        let statusCode = 500;
        let message = err.message;
        let isOperational = false;
        let details = {};

        if (err instanceof CustomError) {
            statusCode = err.statusCode;
            isOperational = err.isOperational;
            details = err.details || {};
        }

        if (err instanceof JsonWebTokenError && statusCode !== 401) {
            statusCode = 401;
            isOperational = true;

            if (message !== 'jwt expired') {
                message = 'Access denied: Invalid Token';
            }
        }

        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                statusCode = 409;
                message = 'Resource Already Exists';
                isOperational = true;
            }
        }

        if (!isOperational) {
            next();
        }

        const finalResponse: ErrorResponse = {
            success,
            statusCode,
            message,
            isOperational,
        };
        if (Object.keys(details).length) {
            finalResponse.details = details;
        }

        res.status(statusCode).json(finalResponse);
    }
}
