import { Router } from 'express';
import multer from 'multer';
import { storageConfig } from '@config/storage';
import { accessControl } from '@middlewares/accessControl';
import { CreateFileController } from '@modules/system/services/createFile/CreateFileController';
import { CreateFolderController } from '@modules/system/services/createFolder/CreateFolderController';
import { DeleteFileController } from '@modules/system/services/deleteFile/DeleteFileController';
import { DeleteFolderController } from '@modules/system/services/deleteFolder/DeleteFolderController';
import { DeleteNotificationController } from '@modules/system/services/deleteNotification/DeleteNotificationController';
import { GenerateKeyControllerController } from '@modules/system/services/generateKey/GenerateKeyController';
import { ListFileController } from '@modules/system/services/listFile/ListFileController';
import { ListFolderController } from '@modules/system/services/listFolder/ListFolderController';
import { ListNotificationController } from '@modules/system/services/listNotification/ListNotificationController';
import { SelectFolderController } from '@modules/system/services/selectFolder/SelectFolderController';
import { ShowFileController } from '@modules/system/services/showFile/ShowFileController';
import { ShowFolderController } from '@modules/system/services/showFolder/ShowFolderController';
import { UpdateFileController } from '@modules/system/services/updateFile/UpdateFileController';
import { UpdateFolderController } from '@modules/system/services/updateFolder/UpdateFolderController';
import { ViewNotificationController } from '@modules/system/services/viewNotification/ViewNotificationController';
import { createFile } from '@modules/system/validators/files/createFile';
import { deleteFile } from '@modules/system/validators/files/deleteFile';
import { listFile } from '@modules/system/validators/files/listFile';
import { showFile } from '@modules/system/validators/files/showFile';
import { updateFile } from '@modules/system/validators/files/updateFile';
import { createFolder } from '@modules/system/validators/folders/createFolder';
import { deleteFolder } from '@modules/system/validators/folders/deleteFolder';
import { listFolder } from '@modules/system/validators/folders/listFolder';
import { selectFolder } from '@modules/system/validators/folders/selectFolder';
import { showFolder } from '@modules/system/validators/folders/showFolder';
import { updateFolder } from '@modules/system/validators/folders/updateFolder';
import { generateKey } from '@modules/system/validators/keys/generateKey';
import { deleteNotification } from '@modules/system/validators/notifications/deleteNotification';
import { listNotification } from '@modules/system/validators/notifications/listNotification';
import { viewNotification } from '@modules/system/validators/notifications/viewNotification';

const systemRouter = Router();
const upload = multer(storageConfig.config.multer);
const generateKeyControllerController = new GenerateKeyControllerController();
const createFolderController = new CreateFolderController();
const listFolderController = new ListFolderController();
const selectFolderController = new SelectFolderController();
const showFolderController = new ShowFolderController();
const updateFolderController = new UpdateFolderController();
const deleteFolderController = new DeleteFolderController();
const createFileController = new CreateFileController();
const listFileController = new ListFileController();
const showFileController = new ShowFileController();
const updateFileController = new UpdateFileController();
const deleteFileController = new DeleteFileController();
const listNotificationController = new ListNotificationController();
const viewNotificationController = new ViewNotificationController();
const deleteNotificationController = new DeleteNotificationController();

systemRouter.get(
  '/generate-keys',
  generateKey,
  generateKeyControllerController.handle,
);

systemRouter.get(
  '/select-folders',
  accessControl,
  selectFolder,
  selectFolderController.handle,
);

systemRouter
  .route('/folders')
  .post(accessControl, createFolder, createFolderController.handle)
  .get(accessControl, listFolder, listFolderController.handle);

systemRouter
  .route('/folders/:id')
  .get(accessControl, showFolder, showFolderController.handle)
  .put(accessControl, updateFolder, updateFolderController.handle)
  .delete(accessControl, deleteFolder, deleteFolderController.handle);

systemRouter
  .route('/files')
  .post(
    accessControl,
    upload.array('files'),
    createFile,
    createFileController.handle,
  )
  .get(accessControl, listFile, listFileController.handle);

systemRouter
  .route('/files/:id')
  .get(accessControl, showFile, showFileController.handle)
  .put(
    accessControl,
    upload.single('file') as never,
    updateFile,
    updateFileController.handle,
  )
  .delete(accessControl, deleteFile, deleteFileController.handle);

systemRouter.get(
  '/notifications',
  accessControl,
  listNotification,
  listNotificationController.handle,
);

systemRouter
  .route('/notifications/:id')
  .patch(accessControl, viewNotification, viewNotificationController.handle)
  .delete(
    accessControl,
    deleteNotification,
    deleteNotificationController.handle,
  );

export { systemRouter };
