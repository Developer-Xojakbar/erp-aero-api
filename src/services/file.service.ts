import path from 'path';
import { prisma } from '../prisma';
import {
    FileServiceDelete,
    FileServiceGetOne,
    FileServiceList,
    FileServiceUpdate,
    FileServiceUpload,
} from '../const';
import { CustomError } from '../utils';

class FileService {
    async upload({ id, fileData }: FileServiceUpload) {
        const {
            originalname: name,
            mimetype: mimeType,
            size,
            buffer,
        } = fileData;

        const extension = name.split('.').pop() as string;

        const file = await prisma.file.create({
            data: {
                name,
                extension,
                mimeType,
                size,
                buffer,
                userId: id,
            },
        });

        return file;
    }

    async list({ id, page, listSize }: FileServiceList) {
        const skip = (page - 1) * listSize;

        const files = await prisma.file.findMany({
            where: {
                userId: id,
            },
            skip,
            take: listSize,
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                buffer: true,
                extension: true,
                mimeType: true,
                name: true,
                size: true,
                updatedAt: true,
                createdAt: true,
            },
        });
        const totalCount = await prisma.file.count();

        return { files, totalCount };
    }

    async delete({ id, fileId }: FileServiceDelete) {
        try {
            await prisma.file.delete({
                where: { id: fileId, userId: id },
            });
        } catch {
            throw new CustomError('File does not exist', 404);
        }
    }

    async getOne({ id, fileId }: FileServiceGetOne) {
        return prisma.file.findUnique({
            where: { id: fileId, userId: id },
            select: {
                buffer: true,
                extension: true,
                mimeType: true,
                name: true,
                size: true,
                updatedAt: true,
                createdAt: true,
            },
        });
    }

    async update({ id, fileId, fileData }: FileServiceUpdate) {
        const { originalname, mimetype, size, buffer } = fileData;

        const extension = path.extname(originalname).slice(1);
        let file;

        try {
            file = await prisma.file.update({
                where: {
                    userId: id,
                    id: fileId,
                },
                data: {
                    name: originalname,
                    extension,
                    mimeType: mimetype,
                    size,
                    buffer,
                },
            });
        } catch {
            throw new CustomError('File does not exist', 404);
        }

        return file;
    }
}

export const fileService = new FileService();
