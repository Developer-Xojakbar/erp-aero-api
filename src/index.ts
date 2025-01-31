import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import * as path from 'path';

const ENV = process.env.NODE_ENV;
if (ENV === 'development') {
    dotenv.config({
        path: path.join(__dirname, '..', '.env'),
    });
} else if (ENV === 'localprod') {
    dotenv.config({
        path: path.join(__dirname, '..', '.env.prod'),
    });
}

import { authRouter, userRouter, fileRouter } from './routes';
import { GlobalErrorHandler } from './utils';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const apiVersion = '/api/v1';

app.use(`${apiVersion}`, authRouter);
app.use(`${apiVersion}`, userRouter);
app.use(`${apiVersion}/file`, fileRouter);

app.use(GlobalErrorHandler.handle);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${apiVersion}`);
});
