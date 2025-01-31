import multer from 'multer';

class MulterService {
    private uploader;

    constructor() {
        this.uploader = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        });
    }

    getUploader(field: string) {
        return this.uploader.single(field);
    }
}

export const multerService = new MulterService();
