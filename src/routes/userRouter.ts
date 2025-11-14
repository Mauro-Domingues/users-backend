import { Router } from 'express';
import { accessControl } from '@middlewares/accessControl';
import { CreatePermissionController } from '@modules/users/services/createPermission/CreatePermissionController';
import { CreateRoleController } from '@modules/users/services/createRole/CreateRoleController';
import { CreateUserController } from '@modules/users/services/createUser/CreateUserController';
import { DeletePermissionController } from '@modules/users/services/deletePermission/DeletePermissionController';
import { DeleteRoleController } from '@modules/users/services/deleteRole/DeleteRoleController';
import { DeleteUserController } from '@modules/users/services/deleteUser/DeleteUserController';
import { ListPermissionController } from '@modules/users/services/listPermission/ListPermissionController';
import { ListRoleController } from '@modules/users/services/listRole/ListRoleController';
import { ListUserController } from '@modules/users/services/listUser/ListUserController';
import { SelectUserController } from '@modules/users/services/selectUser/SelectUserController';
import { ShowPermissionController } from '@modules/users/services/showPermission/ShowPermissionController';
import { ShowRoleController } from '@modules/users/services/showRole/ShowRoleController';
import { ShowSelfUserController } from '@modules/users/services/showSelfUser/ShowSelfUserController';
import { ShowUserController } from '@modules/users/services/showUser/ShowUserController';
import { UpdatePermissionController } from '@modules/users/services/updatePermission/UpdatePermissionController';
import { UpdateRoleController } from '@modules/users/services/updateRole/UpdateRoleController';
import { UpdateUserController } from '@modules/users/services/updateUser/UpdateUserController';
import { createPermission } from '@modules/users/validators/permissions/createPermission';
import { deletePermission } from '@modules/users/validators/permissions/deletePermission';
import { listPermission } from '@modules/users/validators/permissions/listPermission';
import { showPermission } from '@modules/users/validators/permissions/showPermission';
import { updatePermission } from '@modules/users/validators/permissions/updatePermission';
import { createRole } from '@modules/users/validators/roles/createRole';
import { deleteRole } from '@modules/users/validators/roles/deleteRole';
import { listRole } from '@modules/users/validators/roles/listRole';
import { showRole } from '@modules/users/validators/roles/showRole';
import { updateRole } from '@modules/users/validators/roles/updateRole';
import { createUser } from '@modules/users/validators/users/createUser';
import { deleteUser } from '@modules/users/validators/users/deleteUser';
import { listUser } from '@modules/users/validators/users/listUser';
import { selectUser } from '@modules/users/validators/users/selectUser';
import { showSelfUser } from '@modules/users/validators/users/showSelfUser';
import { showUser } from '@modules/users/validators/users/showUser';
import { updateUser } from '@modules/users/validators/users/updateUser';

const userRouter = Router();
const createUserController = new CreateUserController();
const selectUserController = new SelectUserController();
const listUserController = new ListUserController();
const showUserController = new ShowUserController();
const showSelfUserController = new ShowSelfUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const createRoleController = new CreateRoleController();
const listRoleController = new ListRoleController();
const showRoleController = new ShowRoleController();
const updateRoleController = new UpdateRoleController();
const deleteRoleController = new DeleteRoleController();

userRouter.post('/register', createUser, createUserController.handle);
userRouter.get('/select-users', selectUser, selectUserController.handle);
userRouter.get('/me', showSelfUser, showSelfUserController.handle);
userRouter.get('/users', listUser, listUserController.handle);
userRouter.get(
  '/users/:id',
  accessControl,
  showUser,
  showUserController.handle,
);

userRouter
  .route('/users/:id')
  .put(updateUser, updateUserController.handle)
  .delete(deleteUser, deleteUserController.handle);

userRouter
  .route('/roles')
  .post(createRole, createRoleController.handle)
  .get(listRole, listRoleController.handle);

userRouter
  .route('/roles/:id')
  .get(showRole, showRoleController.handle)
  .put(updateRole, updateRoleController.handle)
  .delete(deleteRole, deleteRoleController.handle);

export { userRouter };

const createPermissionController = new CreatePermissionController();
const listPermissionController = new ListPermissionController();
const showPermissionController = new ShowPermissionController();
const updatePermissionController = new UpdatePermissionController();
const deletePermissionController = new DeletePermissionController();

userRouter
  .route('/permissions')
  .post(createPermission, createPermissionController.handle)
  .get(listPermission, listPermissionController.handle);

userRouter
  .route('/permissions/:id')
  .get(showPermission, showPermissionController.handle)
  .put(updatePermission, updatePermissionController.handle)
  .delete(deletePermission, deletePermissionController.handle);
