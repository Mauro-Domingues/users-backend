import type { DeepPartial, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Permission } from '@modules/users/entities/Permission';
import { Role } from '@modules/users/entities/Role';
import { PermissionMethod } from '@modules/users/enums/PermissionMethod';
import { RoleType } from '@modules/users/enums/RoleType';

const permissions: Record<RoleType, Array<Partial<Permission>>> = {
  [RoleType.DEVELOPER]: [
    {
      id: uuid(),
      route: '/permissions',
      name: 'Create permission',
      description: 'This route is responsible for creating a new permission',
      slug: 'permissions___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/permissions/:id',
      name: 'Delete permission',
      description:
        'This route is responsible for deleting a specific permission',
      slug: 'permissions-id___delete',
      method: PermissionMethod.DELETE,
    },
  ],
  [RoleType.ADMIN]: [
    {
      id: uuid(),
      route: '/folders',
      name: 'Create folder',
      description: 'This route is responsible for creating a new folder',
      slug: 'folders___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/folders',
      name: 'List folders',
      description: 'This route is responsible for listing all folders',
      slug: 'folders___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/select-folders',
      name: 'List selectable folders',
      description:
        'This route is responsible for listing folders available for selection',
      slug: 'select-folders___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/folders/:id',
      name: 'Show folder',
      description: 'This route is responsible for showing a specific folder',
      slug: 'folders-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/folders/:id',
      name: 'Update folder',
      description: 'This route is responsible for updating a specific folder',
      slug: 'folders-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/folders/:id',
      name: 'Delete folder',
      description: 'This route is responsible for deleting a specific folder',
      slug: 'folders-id___delete',
      method: PermissionMethod.DELETE,
    },
    {
      id: uuid(),
      route: '/files',
      name: 'List files',
      description: 'This route is responsible for listing all files',
      slug: 'files___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/files/:id',
      name: 'Show file',
      description: 'This route is responsible for showing a specific file',
      slug: 'files-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/files/:id',
      name: 'Update file',
      description: 'This route is responsible for updating a specific file',
      slug: 'files-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/files/:id',
      name: 'Delete file',
      description: 'This route is responsible for deleting a specific file',
      slug: 'files-id___delete',
      method: PermissionMethod.DELETE,
    },
    {
      id: uuid(),
      route: '/roles',
      name: 'Create role',
      description: 'This route is responsible for creating a new role',
      slug: 'roles___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/roles',
      name: 'List roles',
      description: 'This route is responsible for listing all roles',
      slug: 'roles___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/select-roles',
      name: 'List selectable roles',
      description:
        'This route is responsible for listing roles available for selection',
      slug: 'select-roles___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/roles/:id',
      name: 'Show role',
      description: 'This route is responsible for showing a specific role',
      slug: 'roles-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/roles/:id',
      name: 'Update role',
      description: 'This route is responsible for updating a specific role',
      slug: 'roles-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/roles/:id',
      name: 'Delete role',
      description: 'This route is responsible for deleting a specific role',
      slug: 'roles-id___delete',
      method: PermissionMethod.DELETE,
    },
    {
      id: uuid(),
      route: '/permissions',
      name: 'List permissions',
      description: 'This route is responsible for listing all permissions',
      slug: 'permissions___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/permissions/:id',
      name: 'Show permission',
      description:
        'This route is responsible for showing a specific permission',
      slug: 'permissions-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/permissions/:id',
      name: 'Update permission',
      description:
        'This route is responsible for updating a specific permission',
      slug: 'permissions-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/select-users',
      name: 'List selectable users',
      description:
        'This route is responsible for listing users available for selection',
      slug: 'select-users___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/users',
      name: 'List users',
      description: 'This route is responsible for listing all users',
      slug: 'users___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/users/:id',
      name: 'Show user',
      description: 'This route is responsible for showing a specific user',
      slug: 'users-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/users/:id',
      name: 'Delete user',
      description: 'This route is responsible for deleting a specific user',
      slug: 'users-id___delete',
      method: PermissionMethod.DELETE,
    },
    {
      id: uuid(),
      route: '/companies',
      name: 'Create company',
      description: 'This route is responsible for creating a new company',
      slug: 'companies___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/companies/:id',
      name: 'Update company',
      description: 'This route is responsible for updating a specific company',
      slug: 'companies-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/companies/:id',
      name: 'Delete company',
      description: 'This route is responsible for deleting a specific company',
      slug: 'companies-id___delete',
      method: PermissionMethod.DELETE,
    },
    {
      id: uuid(),
      route: '/services',
      name: 'Create service',
      description: 'This route is responsible for creating a new service',
      slug: 'services___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/services',
      name: 'List services',
      description: 'This route is responsible for listing services',
      slug: 'services___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/services/:id',
      name: 'Show service',
      description: 'This route is responsible for showing a specific service',
      slug: 'services-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/services/:id',
      name: 'Update service',
      description: 'This route is responsible for updating a specific service',
      slug: 'services-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/services/:id',
      name: 'Delete service',
      description: 'This route is responsible for deleting a specific service',
      slug: 'services-id___delete',
      method: PermissionMethod.DELETE,
    },
  ],
  [RoleType.CLIENT]: [
    {
      id: uuid(),
      route: '/change-password',
      name: 'Change password',
      description: 'This route is responsible for changing the user password',
      slug: 'change-password___patch',
      method: PermissionMethod.PATCH,
    },
    {
      id: uuid(),
      route: '/files',
      name: 'Create file',
      description: 'This route is responsible for creating a new file',
      slug: 'files___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/me',
      name: 'Show current user',
      description:
        'This route is responsible for showing the authenticated user',
      slug: 'me___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/users/:id',
      name: 'Update user',
      description: 'This route is responsible for updating a specific user',
      slug: 'users-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/notifications/:id',
      name: 'Update notification',
      description:
        'This route is responsible for patching a specific notification',
      slug: 'notifications-id___update',
      method: PermissionMethod.PATCH,
    },
    {
      id: uuid(),
      route: '/notifications/:id',
      name: 'Delete notification',
      description:
        'This route is responsible for deleting a specific notification',
      slug: 'notifications-id___delete',
      method: PermissionMethod.DELETE,
    },
    {
      id: uuid(),
      route: '/notifications',
      name: 'List notification',
      description: 'This route is responsible for listing all notification',
      slug: 'notifications-id___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/appointments',
      name: 'Create appointment',
      description: 'This route is responsible for creating a new appointment',
      slug: 'appointments___create',
      method: PermissionMethod.CREATE,
    },
    {
      id: uuid(),
      route: '/appointments',
      name: 'List appointments',
      description: 'This route is responsible for listing appointments',
      slug: 'appointments___list',
      method: PermissionMethod.LIST,
    },
    {
      id: uuid(),
      route: '/appointments/:id',
      name: 'Show appointment',
      description:
        'This route is responsible for showing a specific appointment',
      slug: 'appointments-id___show',
      method: PermissionMethod.SHOW,
    },
    {
      id: uuid(),
      route: '/appointments/:id',
      name: 'Update appointment',
      description:
        'This route is responsible for updating a specific appointment',
      slug: 'appointments-id___update',
      method: PermissionMethod.UPDATE,
    },
    {
      id: uuid(),
      route: '/appointments/:id',
      name: 'Delete appointment',
      description:
        'This route is responsible for deleting a specific appointment',
      slug: 'appointments-id___delete',
      method: PermissionMethod.DELETE,
    },
  ],
  [RoleType.CUSTOM]: [],
};

const roles: Array<DeepPartial<Role>> = [
  {
    id: uuid(),
    name: 'Developer',
    description: 'Unique role designed to the developer',
    type: RoleType.DEVELOPER,
    permissions: [
      RoleType.DEVELOPER,
      RoleType.ADMIN,
      RoleType.CLIENT,
      RoleType.CUSTOM,
    ].flatMap(key => permissions[key]),
  },
  {
    id: uuid(),
    name: 'Administrator',
    description: 'Unique role designed to the client admin',
    type: RoleType.ADMIN,
    permissions: [RoleType.ADMIN, RoleType.CLIENT, RoleType.CUSTOM].flatMap(
      key => permissions[key],
    ),
  },
  {
    id: uuid(),
    name: 'Client',
    description: 'Unique role designed to the common user',
    type: RoleType.CLIENT,
    permissions: permissions.client,
  },
  {
    id: uuid(),
    name: 'Custom',
    description: 'Custom role designed to specified purposes',
    type: RoleType.CUSTOM,
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
