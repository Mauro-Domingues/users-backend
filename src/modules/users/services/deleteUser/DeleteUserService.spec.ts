import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { DeleteUserService } from './DeleteUserService';

let fakeUsersRepository: IUsersRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let deleteUserService: DeleteUserService;

describe('DeleteUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteUserService = new DeleteUserService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to delete a user', async (): Promise<void> => {
    const user = await fakeUsersRepository.create({
      name: 'user',
      description: 'This is a user',
    });

    await deleteUserService.execute(connection, user.id);

    const deletedUser = await fakeUsersRepository.findBy({
      where: {
        id: user.id,
      },
    });

    expect(deletedUser).toBe(null);
  });

  it('Should not be able to delete a user with a non-existing id', async (): Promise<void> => {
    await expect(
      deleteUserService.execute(connection, 'non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
