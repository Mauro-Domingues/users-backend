import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakePermissionsRepository } from '@modules/users/repositories/fakes/FakePermissionsRepository';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { UpdatePermissionService } from './UpdatePermissionService';

let fakePermissionsRepository: IPermissionsRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let updatePermissionService: UpdatePermissionService;

describe('UpdatePermissionService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakePermissionsRepository = new FakePermissionsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updatePermissionService = new UpdatePermissionService(
      fakePermissionsRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to update a permission', async (): Promise<void> => {
    const permission = await fakePermissionsRepository.create({
      name: 'permission',
      description: 'This is a permission',
    });

    const updatedPermission = await updatePermissionService.execute(
      connection,
      permission.id,
      {
        ...permission,
        name: 'updatedPermission',
      },
    );

    expect(updatedPermission.data.name).toEqual('updatedPermission');
  });

  it('Should not be able to update a permission with a non-existing id', async (): Promise<void> => {
    await expect(
      updatePermissionService.execute(connection, 'non-existing-permission-id', {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
