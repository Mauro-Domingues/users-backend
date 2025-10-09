import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeFoldersRepository } from '@modules/system/repositories/fakes/FakeFoldersRepository';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { CreateFolderService } from './CreateFolderService';

let fakeFoldersRepository: IFoldersRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let createFolderService: CreateFolderService;

describe('CreateFolderService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFoldersRepository = new FakeFoldersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createFolderService = new CreateFolderService(
      fakeFoldersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new folder', async (): Promise<void> => {
    const folder = await createFolderService.execute(connection, {
      name: 'folder',
      description: 'This is a folder',
    });

    expect(folder.data).toHaveProperty('id');
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeFoldersRepository, 'create').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_CREATE', 'Failed to create a folder');
    });

    await expect(
      createFolderService.execute(connection, {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
