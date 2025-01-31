import { Router } from 'express';
import { auth } from '../middlewares';
import { fileController } from '../controllers';
import { multerService } from '../services';

const fileRouter = Router();

fileRouter.post(
    '/upload',
    auth.authenticate,
    multerService.getUploader('file'),
    fileController.upload,
);
fileRouter.get('/list', auth.authenticate, fileController.list);
fileRouter.delete('/delete/:id', auth.authenticate, fileController.delete);
fileRouter.get('/:id', auth.authenticate, fileController.getOne);
fileRouter.get('/download/:id', auth.authenticate, fileController.download);
fileRouter.put(
    '/update/:id',
    auth.authenticate,
    multerService.getUploader('file'),
    fileController.update,
);

export { fileRouter };
