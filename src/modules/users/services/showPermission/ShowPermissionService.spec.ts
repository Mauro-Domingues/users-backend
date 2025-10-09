import { AppError } from '@shared/errors/AppError';
import { FakePermissionsRepository } from '@modules/users/repositories/fakes/FakePermissionsRepository';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { ShowPermissionService } from './ShowPermissionService';

let fakePermissionsRepository: IPermissionsRepository;
let connection: IConnection;
let showPermissionService: ShowPermissionService;

describe('ShowPermissionService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakePermissionsRepository = new FakePermissionsRepository();
    showPermissionService = new ShowPermissionService(
      fakePermissionsRepository,
      connection,
    );
  });

  it('Should be able to show a permission', async (): Promise<void> => {
    const permission = await fakePermissionsRepository.create({
      name: 'permission',
      description: 'This is a permission',
    });

    const getPermission = await showPermissionService.execute(permission.id);

    expect(getPermission.data).toHaveProperty('id');
    expect(getPermission.data).toEqual(permission);
  });

  it('Should not be able to show a permission with a non-existing id', async (): Promise<void> => {
    await expect(
      showPermissionService.execute('non-existing-permission-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
