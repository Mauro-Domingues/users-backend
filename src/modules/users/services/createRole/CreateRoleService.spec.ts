import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeRolesRepository } from '@modules/users/repositories/fakes/FakeRolesRepository';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { CreateRoleService } from './CreateRoleService';

let fakeRolesRepository: IRolesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let createRoleService: CreateRoleService;

describe('CreateRoleService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeRolesRepository = new FakeRolesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createRoleService = new CreateRoleService(
      fakeRolesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new role', async (): Promise<void> => {
    const role = await createRoleService.execute(connection, {
      name: 'role',
      description: 'This is a role',
    });

    expect(role.data).toHaveProperty('id');
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeRolesRepository, 'create').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_CREATE', 'Failed to create a role');
    });

    await expect(
      createRoleService.execute(connection, {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
