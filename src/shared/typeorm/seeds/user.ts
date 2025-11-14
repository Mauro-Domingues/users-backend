import { hash } from 'bcrypt';
import type { QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hashConfig } from '@config/hash';
import { IRoleTypeDTO } from '@modules/users/dtos/IRoleTypeDTO';
import { Role } from '@modules/users/entities/Role';
import { User } from '@modules/users/entities/User';

async function getPasswords(): Promise<{
  developerPassword: string;
  adminPassword: string;
}> {
  return {
    developerPassword: await hash('Developer*123@', hashConfig.config.salt),
    adminPassword: await hash('Admin*123@', hashConfig.config.salt),
  };
}

async function getRoles(trx: QueryRunner): Promise<{
  developerRole: Role | undefined;
  adminRole: Role | undefined;
}> {
  const roles = await trx.manager
    .createQueryBuilder(Role, 'roles')
    .leftJoinAndSelect('roles.permissions', 'permissions')
    .where('roles.type IN (:...types)', {
      types: [IRoleTypeDTO.DEVELOPER, IRoleTypeDTO.ADMIN],
    })
    .select(['roles.id', 'roles.type', 'permissions.id'])
    .getMany();

  return {
    developerRole: roles.find(role => role.type === IRoleTypeDTO.DEVELOPER),
    adminRole: roles.find(role => role.type === IRoleTypeDTO.ADMIN),
  };
}

async function getUsers(trx: QueryRunner): Promise<Array<Partial<User>>> {
  const { developerPassword, adminPassword } = await getPasswords();
  const { developerRole, adminRole } = await getRoles(trx);

  return [
    {
      id: uuid(),
      email: 'developer@mail.com.br',
      password: developerPassword,
      roleId: developerRole?.id,
      permissions: developerRole?.permissions,
    },
    {
      id: uuid(),
      email: 'manager@mail.com.br',
      password: adminPassword,
      roleId: adminRole?.id,
      permissions: adminRole?.permissions,
    },
  ];
}

async function seedRolesPermissions(
  users: Array<Partial<User>>,
  trx: QueryRunner,
): Promise<void> {
  return trx.manager
    .createQueryBuilder()
    .insert()
    .into('users_permissions')
    .values(
      Object.values(users).flatMap(user =>
        user.permissions?.map(permission => ({
          permission_id: permission.id,
          user_id: user.id,
        })),
      ),
    )
    .execute()
    .then(() => console.log('Users Permissions pivot seeded'));
}

export async function seedUser(trx: QueryRunner): Promise<void> {
  const users = await getUsers(trx);

  await trx.manager
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(users)
    .execute()
    .then(() => console.log('Users seeded'));

  return seedRolesPermissions(users, trx);
}
