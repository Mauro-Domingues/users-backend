import { FakeRolesRepository } from '@modules/users/repositories/fakes/FakeRolesRepository';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { ListRoleService } from './ListRoleService';

let fakeRolesRepository: IRolesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let listRoleService: ListRoleService;

describe('ListRoleService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeRolesRepository = new FakeRolesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listRoleService = new ListRoleService(
      fakeRolesRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('Should be able to list all the roles', async (): Promise<void> => {
    const [role01, role02] = await fakeRolesRepository.createMany([
      {
        name: 'role 1',
        description: 'This is the first role',
      },
      {
        name: 'role 2',
        description: 'This is the second role',
      },
    ]);

    const roleList = await listRoleService.execute(1, 2, {});

    expect(roleList.data).toEqual([role01, role02]);
  });

  it('Should be able to list all the roles using cache', async (): Promise<void> => {
    const [role01, role02] = await fakeRolesRepository.createMany([
      {
        name: 'role 1',
        description: 'This is the first role',
      },
      {
        name: 'role 2',
        description: 'This is the second role',
      },
    ]);

    await listRoleService.execute(1, 2, {});

    const roleList = await listRoleService.execute(1, 2, {});

    expect(roleList.data).toEqual(
      JSON.parse(JSON.stringify([role01, role02])),
    );
  });

  it('Should be able to list the roles with the specified pagination', async (): Promise<void> => {
    const [role01, role02] = await fakeRolesRepository.createMany([
      {
        name: 'role 1',
        description: 'This is the first role',
      },
      {
        name: 'role 2',
        description: 'This is the second role',
      },
      {
        name: 'role 3',
        description: 'This is the third role',
      },
    ]);

    const roleList01 = await listRoleService.execute(1, 1, {});

    expect(roleList01.data).toEqual([role01]);

    const roleList02 = await listRoleService.execute(1, 2, {});

    expect(roleList02.data).toEqual([role01, role02]);
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeRolesRepository, 'findAll').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_LIST', 'Failed to list roles');
    });

    await expect(listRoleService.execute(1, 2, {})).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
