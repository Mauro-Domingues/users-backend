import { AppError } from '@shared/errors/AppError';
import { FakeRolesRepository } from '@modules/users/repositories/fakes/FakeRolesRepository';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { ShowRoleService } from './ShowRoleService';

let fakeRolesRepository: IRolesRepository;
let connection: IConnection;
let showRoleService: ShowRoleService;

describe('ShowRoleService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeRolesRepository = new FakeRolesRepository();
    showRoleService = new ShowRoleService(
      fakeRolesRepository,
      connection,
    );
  });

  it('Should be able to show a role', async (): Promise<void> => {
    const role = await fakeRolesRepository.create({
      name: 'role',
      description: 'This is a role',
    });

    const getRole = await showRoleService.execute(role.id);

    expect(getRole.data).toHaveProperty('id');
    expect(getRole.data).toEqual(role);
  });

  it('Should not be able to show a role with a non-existing id', async (): Promise<void> => {
    await expect(
      showRoleService.execute('non-existing-role-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
