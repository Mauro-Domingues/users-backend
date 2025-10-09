import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeRolesRepository } from '@modules/users/repositories/fakes/FakeRolesRepository';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { DeleteRoleService } from './DeleteRoleService';

let fakeRolesRepository: IRolesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let deleteRoleService: DeleteRoleService;

describe('DeleteRoleService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeRolesRepository = new FakeRolesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteRoleService = new DeleteRoleService(
      fakeRolesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to delete a role', async (): Promise<void> => {
    const role = await fakeRolesRepository.create({
      name: 'role',
      description: 'This is a role',
    });

    await deleteRoleService.execute(connection, role.id);

    const deletedRole = await fakeRolesRepository.findBy({
      where: {
        id: role.id,
      },
    });

    expect(deletedRole).toBe(null);
  });

  it('Should not be able to delete a role with a non-existing id', async (): Promise<void> => {
    await expect(
      deleteRoleService.execute(connection, 'non-existing-role-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
