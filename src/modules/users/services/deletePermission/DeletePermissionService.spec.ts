import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakePermissionsRepository } from '@modules/users/repositories/fakes/FakePermissionsRepository';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { DeletePermissionService } from './DeletePermissionService';

let fakePermissionsRepository: IPermissionsRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let deletePermissionService: DeletePermissionService;

describe('DeletePermissionService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakePermissionsRepository = new FakePermissionsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deletePermissionService = new DeletePermissionService(
      fakePermissionsRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('Should be able to delete a permission', async (): Promise<void> => {
    const permission = await fakePermissionsRepository.create({
      name: 'permission',
      description: 'This is a permission',
    });

    await deletePermissionService.execute(permission.id);

    const deletedPermission = await fakePermissionsRepository.findBy({
      where: {
        id: permission.id,
      },
    });

    expect(deletedPermission).toBe(null);
  });

  it('Should not be able to delete a permission with a non-existing id', async (): Promise<void> => {
    await expect(
      deletePermissionService.execute('non-existing-permission-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
