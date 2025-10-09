import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { UpdateUserService } from './UpdateUserService';

let fakeUsersRepository: IUsersRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let updateUserService: UpdateUserService;

describe('UpdateUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateUserService = new UpdateUserService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to update a user', async (): Promise<void> => {
    const user = await fakeUsersRepository.create({
      name: 'user',
      description: 'This is a user',
    });

    const updatedUser = await updateUserService.execute(
      connection,
      user.id,
      {
        ...user,
        name: 'updatedUser',
      },
    );

    expect(updatedUser.data.name).toEqual('updatedUser');
  });

  it('Should not be able to update a user with a non-existing id', async (): Promise<void> => {
    await expect(
      updateUserService.execute(connection, 'non-existing-user-id', {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
