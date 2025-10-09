import { AppError } from '@shared/errors/AppError';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { ShowUserService } from './ShowUserService';

let fakeUsersRepository: IUsersRepository;
let connection: IConnection;
let showUserService: ShowUserService;

describe('ShowUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserService = new ShowUserService(fakeUsersRepository);
  });

  it('Should be able to show a user', async (): Promise<void> => {
    const user = await fakeUsersRepository.create({
      name: 'user',
      description: 'This is a user',
    });

    const getUser = await showUserService.execute(connection, user.id);

    expect(getUser.data).toHaveProperty('id');
    expect(getUser.data).toEqual(user);
  });

  it('Should not be able to show a user with a non-existing id', async (): Promise<void> => {
    await expect(
      showUserService.execute(connection, 'non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
