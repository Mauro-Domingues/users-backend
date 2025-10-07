import { Router } from 'express';
import { celebrate } from 'celebrate';
import { CreateUserController } from '@modules/users/services/createUser/CreateUserController';
import { ShowUserController } from '@modules/users/services/showUser/ShowUserController';
import { ListUserController } from '@modules/users/services/listUser/ListUserController';
import { UpdateUserController } from '@modules/users/services/updateUser/UpdateUserController';
import { DeleteUserController } from '@modules/users/services/deleteUser/DeleteUserController';
import { ShowSelfUserController } from '@modules/users/services/showSelfUser/ShowSelfUserController';
import { createUser } from '@modules/users/validators/users/createUser';
import { listUser } from '@modules/users/validators/users/listUser';
import { showUser } from '@modules/users/validators/users/showUser';
import { updateUser } from '@modules/users/validators/users/updateUser';
import { deleteUser } from '@modules/users/validators/users/deleteUser';
import { showSelfUser } from '@modules/users/validators/users/showSelfUser';
import { SelectUserController } from '@modules/users/services/selectUser/SelectUserController';
import { selectUser } from '@modules/users/validators/users/selectUser';
import { CreateRoleController } from '@modules/users/services/createRole/CreateRoleController';
import { ShowRoleController } from '@modules/users/services/showRole/ShowRoleController';
import { ListRoleController } from '@modules/users/services/listRole/ListRoleController';
import { UpdateRoleController } from '@modules/users/services/updateRole/UpdateRoleController';
import { DeleteRoleController } from '@modules/users/services/deleteRole/DeleteRoleController';
import { createRole } from '@modules/users/validators/roles/createRole';
import { listRole } from '@modules/users/validators/roles/listRole';
import { showRole } from '@modules/users/validators/roles/showRole';
import { updateRole } from '@modules/users/validators/roles/updateRole';
import { deleteRole } from '@modules/users/validators/roles/deleteRole';

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
userRouter.get(
  '/users',
  listUser as ReturnType<typeof celebrate>,
  listUserController.handle,
);
userRouter.get(
  '/users/:id',
  showUser as ReturnType<typeof celebrate>,
  showUserController.handle,
);

userRouter
  .route('/users/:id')
  .put(updateUser as ReturnType<typeof celebrate>, updateUserController.handle)
  .delete(
    deleteUser as ReturnType<typeof celebrate>,
    deleteUserController.handle,
  );

userRouter
  .route('/roles')
  .post(createRole, createRoleController.handle)
  .get(listRole as ReturnType<typeof celebrate>, listRoleController.handle);

userRouter
  .route('/roles/:id')
  .get(showRole as ReturnType<typeof celebrate>, showRoleController.handle)
  .put(updateRole as ReturnType<typeof celebrate>, updateRoleController.handle)
  .delete(
    deleteRole as ReturnType<typeof celebrate>,
    deleteRoleController.handle,
  );

export { userRouter };
