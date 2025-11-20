import type { DeepPartial, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IPermissionMethodDTO } from '@modules/users/dtos/IPermissionMethodDTO';
import { IRoleTypeDTO } from '@modules/users/dtos/IRoleTypeDTO';
import { Permission } from '@modules/users/entities/Permission';
import { Role } from '@modules/users/entities/Role';

const permissions: Record<IRoleTypeDTO, Array<Partial<Permission>>> = {
  [IRoleTypeDTO.DEVELOPER]: [
    {
      id: uuid(),
      route: '/permissions',
      name: 'Create permission',
      description: 'This route is responsible for creating a new permission',
      slug: 'permissions___create',
      method: IPermissionMethodDTO.CREATE,
    },
    {
      id: uuid(),
      route: '/permissions/:id',
      name: 'Delete permission',
      description:
        'This route is responsible for deleting a specific permission',
      slug: 'permissions-id___delete',
      method: IPermissionMethodDTO.DELETE,
    },
  ],
  [IRoleTypeDTO.ADMIN]: [
    {
      id: uuid(),
      route: '/folders',
      name: 'Create folder',
      description: 'This route is responsible for creating a new folder',
      slug: 'folders___create',
      method: IPermissionMethodDTO.CREATE,
    },
    {
      id: uuid(),
      route: '/folders',
      name: 'List folders',
      description: 'This route is responsible for listing all folders',
      slug: 'folders___list',
      method: IPermissionMethodDTO.LIST,
    },
    {
      id: uuid(),
      route: '/folders/:id',
      name: 'Show folder',
      description: 'This route is responsible for showing a specific folder',
      slug: 'folders-id___show',
      method: IPermissionMethodDTO.SHOW,
    },
    {
      id: uuid(),
      route: '/folders/:id',
      name: 'Update folder',
      description: 'This route is responsible for updating a specific folder',
      slug: 'folders-id___update',
      method: IPermissionMethodDTO.UPDATE,
    },
    {
      id: uuid(),
      route: '/folders/:id',
      name: 'Delete folder',
      description: 'This route is responsible for deleting a specific folder',
      slug: 'folders-id___delete',
      method: IPermissionMethodDTO.DELETE,
    },
    {
      id: uuid(),
      route: '/files',
      name: 'List files',
      description: 'This route is responsible for listing all files',
      slug: 'files___list',
      method: IPermissionMethodDTO.LIST,
    },
    {
      id: uuid(),
      route: '/files/:id',
      name: 'Show file',
      description: 'This route is responsible for showing a specific file',
      slug: 'files-id___show',
      method: IPermissionMethodDTO.SHOW,
    },
    {
      id: uuid(),
      route: '/files/:id',
      name: 'Update file',
      description: 'This route is responsible for updating a specific file',
      slug: 'files-id___update',
      method: IPermissionMethodDTO.UPDATE,
    },
    {
      id: uuid(),
      route: '/files/:id',
      name: 'Delete file',
      description: 'This route is responsible for deleting a specific file',
      slug: 'files-id___delete',
      method: IPermissionMethodDTO.DELETE,
    },
    {
      id: uuid(),
      route: '/roles',
      name: 'Create role',
      description: 'This route is responsible for creating a new role',
      slug: 'roles___create',
      method: IPermissionMethodDTO.CREATE,
    },
    {
      id: uuid(),
      route: '/roles',
      name: 'List roles',
      description: 'This route is responsible for listing all roles',
      slug: 'roles___list',
      method: IPermissionMethodDTO.LIST,
    },
    {
      id: uuid(),
      route: '/roles/:id',
      name: 'Show role',
      description: 'This route is responsible for showing a specific role',
      slug: 'roles-id___show',
      method: IPermissionMethodDTO.SHOW,
    },
    {
      id: uuid(),
      route: '/roles/:id',
      name: 'Update role',
      description: 'This route is responsible for updating a specific role',
      slug: 'roles-id___update',
      method: IPermissionMethodDTO.UPDATE,
    },
    {
      id: uuid(),
      route: '/roles/:id',
      name: 'Delete role',
      description: 'This route is responsible for deleting a specific role',
      slug: 'roles-id___delete',
      method: IPermissionMethodDTO.DELETE,
    },
    {
      id: uuid(),
      route: '/permissions',
      name: 'List permissions',
      description: 'This route is responsible for listing all permissions',
      slug: 'permissions___list',
      method: IPermissionMethodDTO.LIST,
    },
    {
      id: uuid(),
      route: '/permissions/:id',
      name: 'Show permission',
      description:
        'This route is responsible for showing a specific permission',
      slug: 'permissions-id___show',
      method: IPermissionMethodDTO.SHOW,
    },
    {
      id: uuid(),
      route: '/permissions/:id',
      name: 'Update permission',
      description:
        'This route is responsible for updating a specific permission',
      slug: 'permissions-id___update',
      method: IPermissionMethodDTO.UPDATE,
    },
    {
      id: uuid(),
      route: '/select-users',
      name: 'List selectable users',
      description:
        'This route is responsible for listing users available for selection',
      slug: 'select-users___list',
      method: IPermissionMethodDTO.LIST,
    },
    {
      id: uuid(),
      route: '/users',
      name: 'List users',
      description: 'This route is responsible for listing all users',
      slug: 'users___list',
      method: IPermissionMethodDTO.LIST,
    },
    {
      id: uuid(),
      route: '/users/:id',
      name: 'Show user',
      description: 'This route is responsible for showing a specific user',
      slug: 'users-id___show',
      method: IPermissionMethodDTO.SHOW,
    },
    {
      id: uuid(),
      route: '/users/:id',
      name: 'Delete user',
      description: 'This route is responsible for deleting a specific user',
      slug: 'users-id___delete',
      method: IPermissionMethodDTO.DELETE,
    },
  ],
  [IRoleTypeDTO.CLIENT]: [
    {
      id: uuid(),
      route: '/change-password',
      name: 'Change password',
      description: 'This route is responsible for changing the user password',
      slug: 'change-password___patch',
      method: IPermissionMethodDTO.PATCH,
    },
    {
      id: uuid(),
      route: '/files',
      name: 'Create file',
      description: 'This route is responsible for creating a new file',
      slug: 'files___create',
      method: IPermissionMethodDTO.CREATE,
    },
    {
      id: uuid(),
      route: '/me',
      name: 'Show current user',
      description:
        'This route is responsible for showing the authenticated user',
      slug: 'me___show',
      method: IPermissionMethodDTO.SHOW,
    },
    {
      id: uuid(),
      route: '/users/:id',
      name: 'Update user',
      description: 'This route is responsible for updating a specific user',
      slug: 'users-id___update',
      method: IPermissionMethodDTO.UPDATE,
    },
  ],
  [IRoleTypeDTO.CUSTOM]: [],
};

const roles: Array<DeepPartial<Role>> = [
  {
    id: uuid(),
    name: 'Developer',
    description: 'Unique role designed to the developer',
    type: IRoleTypeDTO.DEVELOPER,
    permissions: [
      IRoleTypeDTO.DEVELOPER,
      IRoleTypeDTO.ADMIN,
      IRoleTypeDTO.CLIENT,
      IRoleTypeDTO.CUSTOM,
    ].flatMap(key => permissions[key]),
  },
  {
    id: uuid(),
    name: 'Administrator',
    description: 'Unique role designed to the client admin',
    type: IRoleTypeDTO.ADMIN,
    permissions: [
      IRoleTypeDTO.ADMIN,
      IRoleTypeDTO.CLIENT,
      IRoleTypeDTO.CUSTOM,
    ].flatMap(key => permissions[key]),
  },
  {
    id: uuid(),
    name: 'Client',
    description: 'Unique role designed to the common user',
    type: IRoleTypeDTO.CLIENT,
    permissions: permissions.client,
  },
  {
    id: uuid(),
    name: 'Custom',
    description: 'Custom role designed to specified purposes',
    type: IRoleTypeDTO.CUSTOM,
    permissions: permissions.custom,
  },
];

async function seedPermission(trx: QueryRunner): Promise<void> {
  return trx.manager
    .createQueryBuilder()
    .insert()
    .into(Permission)
    .values(Object.values(permissions).flat())
    .execute()
    .then(() => console.log('Permisions seeded'));
}

async function seedRole(trx: QueryRunner): Promise<void> {
  return trx.manager
    .createQueryBuilder()
    .insert()
    .into(Role)
    .values(
      roles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        type: role.type,
      })),
    )
    .execute()
    .then(() => console.log('Roles seeded'));
}

async function seedRolesPermissions(trx: QueryRunner): Promise<void> {
  return trx.manager
    .createQueryBuilder()
    .insert()
    .into('roles_permissions')
    .values(
      roles.flatMap(role =>
        role.permissions?.map(permission => ({
          permission_id: permission.id,
          role_id: role.id,
        })),
      ),
    )
    .execute()
    .then(() => console.log('Roles Permissions pivot seeded'));
}

export async function seedAccessControl(trx: QueryRunner): Promise<void> {
  await seedPermission(trx);
  await seedRole(trx);
  return seedRolesPermissions(trx);
}
