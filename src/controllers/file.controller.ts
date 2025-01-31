import { Request, Response } from 'express';
import { catchAsync, CustomError } from '../utils';
import { fileService } from '../services';
import {
    EmptyParams,
    ResBody,
    ReqBody,
    FileListQuery,
    MongoDocIdParams,
} from '../const';

class FileController {
    upload = catchAsync(
        async (req: Request<EmptyParams, ResBody, ReqBody>, res: Response) => {
            const { id } = req.user;
            const fileData = req.file;

            if (!fileData) {
                throw new CustomError('File does not exist', 404);
            }

            const file = await fileService.upload({ id, fileData });

            res.status(200).json({
                id: file.id,
                message: 'File uploaded successfully',
            });
        },
    );

    list = catchAsync(
        async (
            req: Request<EmptyParams, ResBody, ReqBody, FileListQuery>,
            res: Response,
        ) => {
            const { id } = req.user;
            const page = parseInt(req.query.page) || 1;
            const listSize = parseInt(req.query.list_size) || 10;

            const { files, totalCount } = await fileService.list({
                id,
                page,
                listSize,
            });

            res.status(200).json({
                files,
                totalCount,
                totalPages: Math.ceil(totalCount / listSize),
            });
        },
    );

    delete = catchAsync(
        async (
            req: Request<MongoDocIdParams, ResBody, ReqBody>,
            res: Response,
        ) => {
            const { id } = req.user;
            const fileId = parseInt(req.params.id);

            await fileService.delete({ id, fileId });

            res.status(200).json({ message: 'File deleted successfully' });
        },
    );

    getOne = catchAsync(
        async (
            req: Request<MongoDocIdParams, ResBody, ReqBody>,
            res: Response,
        ) => {
            const { id } = req.user;
            const fileId = parseInt(req.params.id);

            const file = await fileService.getOne({ id, fileId });

            if (!file) {
                throw new CustomError('File does not exist', 404);
            }

            res.status(200).json({ file });
        },
    );

    download = catchAsync(
        async (
            req: Request<MongoDocIdParams, ResBody, ReqBody>,
            res: Response,
        ) => {
            const { id } = req.user;
            const fileId = parseInt(req.params.id);

            const file = await fileService.getOne({ id, fileId });

            if (!file) {
                throw new CustomError('File does not exist', 404);
            }

            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${file.name}"`,
            );
            res.setHeader('Content-Type', file.mimeType);
            res.send(Buffer.from(file.buffer));
        },
    );

    update = catchAsync(
        async (
            req: Request<MongoDocIdParams, ResBody, ReqBody>,
            res: Response,
        ) => {
            const { id } = req.user;
            const fileId = parseInt(req.params.id);
            const fileData = req.file;

            if (!fileData) {
                throw new CustomError('File does not exist', 404);
            }

            await fileService.update({ id, fileId, fileData });

            res.status(200).json({ message: 'File updated successfully' });
        },
    );
}

export const fileController = new FileController();
