import { storageConfig } from '@config/storage';
import { celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { GenerateKeyControllerController } from '@modules/system/services/generateKey/GenerateKeyController';
import { CreateFolderController } from '@modules/system/services/createFolder/CreateFolderController';
import { ShowFolderController } from '@modules/system/services/showFolder/ShowFolderController';
import { ListFolderController } from '@modules/system/services/listFolder/ListFolderController';
import { UpdateFolderController } from '@modules/system/services/updateFolder/UpdateFolderController';
import { DeleteFolderController } from '@modules/system/services/deleteFolder/DeleteFolderController';
import { CreateFileController } from '@modules/system/services/createFile/CreateFileController';
import { ShowFileController } from '@modules/system/services/showFile/ShowFileController';
import { ListFileController } from '@modules/system/services/listFile/ListFileController';
import { UpdateFileController } from '@modules/system/services/updateFile/UpdateFileController';
import { DeleteFileController } from '@modules/system/services/deleteFile/DeleteFileController';
import { showFile } from '@modules/system/validators/files/showFile';
import { updateFolder } from '@modules/system/validators/folders/updateFolder';
import { createFolder } from '@modules/system/validators/folders/createFolder';
import { deleteFolder } from '@modules/system/validators/folders/deleteFolder';
import { showFolder } from '@modules/system/validators/folders/showFolder';
import { generateKey } from '@modules/system/validators/keys/generateKey';
import { listFolder } from '@modules/system/validators/folders/listFolder';
import { createFile } from '@modules/system/validators/files/createFile';
import { listFile } from '@modules/system/validators/files/listFile';
import { updateFile } from '@modules/system/validators/files/updateFile';
import { deleteFile } from '@modules/system/validators/files/deleteFile';

const systemRouter = Router();
const upload = multer(storageConfig.config.multer);
const generateKeyControllerController = new GenerateKeyControllerController();
const createFolderController = new CreateFolderController();
const listFolderController = new ListFolderController();
const showFolderController = new ShowFolderController();
const updateFolderController = new UpdateFolderController();
const deleteFolderController = new DeleteFolderController();
const createFileController = new CreateFileController();
const listFileController = new ListFileController();
const showFileController = new ShowFileController();
const updateFileController = new UpdateFileController();
const deleteFileController = new DeleteFileController();

systemRouter.get(
  '/generate-keys',
  generateKey,
  generateKeyControllerController.handle,
);

systemRouter
  .route('/folders')
  .post(createFolder, createFolderController.handle)
  .get(listFolder as ReturnType<typeof celebrate>, listFolderController.handle);

systemRouter
  .route('/folders/:id')
  .get(showFolder as ReturnType<typeof celebrate>, showFolderController.handle)
  .put(
    updateFolder as ReturnType<typeof celebrate>,
    updateFolderController.handle,
  )
  .delete(
    deleteFolder as ReturnType<typeof celebrate>,
    deleteFolderController.handle,
  );

systemRouter
  .route('/files')
  .post(upload.array('files'), createFile, createFileController.handle)
  .get(listFile, listFileController.handle);

systemRouter
  .route('/files/:id')
  .get(showFile as ReturnType<typeof celebrate>, showFileController.handle)
  .put(
    upload.single('file') as never,
    updateFile as ReturnType<typeof celebrate>,
    updateFileController.handle,
  )
  .delete(
    deleteFile as ReturnType<typeof celebrate>,
    deleteFileController.handle,
  );

export { systemRouter };
