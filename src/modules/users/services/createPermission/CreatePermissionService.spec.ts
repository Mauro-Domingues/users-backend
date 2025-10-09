import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakePermissionsRepository } from '@modules/users/repositories/fakes/FakePermissionsRepository';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { CreatePermissionService } from './CreatePermissionService';

let fakePermissionsRepository: IPermissionsRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let createPermissionService: CreatePermissionService;

describe('CreatePermissionService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakePermissionsRepository = new FakePermissionsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createPermissionService = new CreatePermissionService(
      fakePermissionsRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new permission', async (): Promise<void> => {
    const permission = await createPermissionService.execute(connection, {
      name: 'permission',
      description: 'This is a permission',
    });

    expect(permission.data).toHaveProperty('id');
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakePermissionsRepository, 'create').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_CREATE', 'Failed to create a permission');
    });

    await expect(
      createPermissionService.execute(connection, {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
