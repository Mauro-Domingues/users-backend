import { FakePermissionsRepository } from '@modules/users/repositories/fakes/FakePermissionsRepository';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { ListPermissionService } from './ListPermissionService';

let fakePermissionsRepository: IPermissionsRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let listPermissionService: ListPermissionService;

describe('ListPermissionService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakePermissionsRepository = new FakePermissionsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listPermissionService = new ListPermissionService(
      fakePermissionsRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('Should be able to list all the permissions', async (): Promise<void> => {
    const [permission01, permission02] = await fakePermissionsRepository.createMany([
      {
        name: 'permission 1',
        description: 'This is the first permission',
      },
      {
        name: 'permission 2',
        description: 'This is the second permission',
      },
    ]);

    const permissionList = await listPermissionService.execute(1, 2, {});

    expect(permissionList.data).toEqual([permission01, permission02]);
  });

  it('Should be able to list all the permissions using cache', async (): Promise<void> => {
    const [permission01, permission02] = await fakePermissionsRepository.createMany([
      {
        name: 'permission 1',
        description: 'This is the first permission',
      },
      {
        name: 'permission 2',
        description: 'This is the second permission',
      },
    ]);

    await listPermissionService.execute(1, 2, {});

    const permissionList = await listPermissionService.execute(1, 2, {});

    expect(permissionList.data).toEqual(
      JSON.parse(JSON.stringify([permission01, permission02])),
    );
  });

  it('Should be able to list the permissions with the specified pagination', async (): Promise<void> => {
    const [permission01, permission02] = await fakePermissionsRepository.createMany([
      {
        name: 'permission 1',
        description: 'This is the first permission',
      },
      {
        name: 'permission 2',
        description: 'This is the second permission',
      },
      {
        name: 'permission 3',
        description: 'This is the third permission',
      },
    ]);

    const permissionList01 = await listPermissionService.execute(1, 1, {});

    expect(permissionList01.data).toEqual([permission01]);

    const permissionList02 = await listPermissionService.execute(1, 2, {});

    expect(permissionList02.data).toEqual([permission01, permission02]);
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakePermissionsRepository, 'findAll').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_LIST', 'Failed to list permissions');
    });

    await expect(listPermissionService.execute(1, 2, {})).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
