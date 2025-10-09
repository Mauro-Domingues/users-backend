import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeRolesRepository } from '@modules/users/repositories/fakes/FakeRolesRepository';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { UpdateRoleService } from './UpdateRoleService';

let fakeRolesRepository: IRolesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let updateRoleService: UpdateRoleService;

describe('UpdateRoleService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeRolesRepository = new FakeRolesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateRoleService = new UpdateRoleService(
      fakeRolesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to update a role', async (): Promise<void> => {
    const role = await fakeRolesRepository.create({
      name: 'role',
      description: 'This is a role',
    });

    const updatedRole = await updateRoleService.execute(
      connection,
      role.id,
      {
        ...role,
        name: 'updatedRole',
      },
    );

    expect(updatedRole.data.name).toEqual('updatedRole');
  });

  it('Should not be able to update a role with a non-existing id', async (): Promise<void> => {
    await expect(
      updateRoleService.execute(connection, 'non-existing-role-id', {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
