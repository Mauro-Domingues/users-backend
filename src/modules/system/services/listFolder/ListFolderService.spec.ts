import { FakeFoldersRepository } from '@modules/system/repositories/fakes/FakeFoldersRepository';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { ListFolderService } from './ListFolderService';

let fakeFoldersRepository: IFoldersRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let listFolderService: ListFolderService;

describe('ListFolderService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFoldersRepository = new FakeFoldersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listFolderService = new ListFolderService(
      fakeFoldersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to list all the folders', async (): Promise<void> => {
    const [folder01, folder02] = await fakeFoldersRepository.createMany([
      {
        name: 'folder 1',
        description: 'This is the first folder',
      },
      {
        name: 'folder 2',
        description: 'This is the second folder',
      },
    ]);

    const folderList = await listFolderService.execute(connection, 1, 2, {});

    expect(folderList.data).toEqual([folder01, folder02]);
  });

  it('Should be able to list all the folders using cache', async (): Promise<void> => {
    const [folder01, folder02] = await fakeFoldersRepository.createMany([
      {
        name: 'folder 1',
        description: 'This is the first folder',
      },
      {
        name: 'folder 2',
        description: 'This is the second folder',
      },
    ]);

    await listFolderService.execute(connection, 1, 2, {});

    const folderList = await listFolderService.execute(connection, 1, 2, {});

    expect(folderList.data).toEqual(
      JSON.parse(JSON.stringify([folder01, folder02])),
    );
  });

  it('Should be able to list the folders with the specified pagination', async (): Promise<void> => {
    const [folder01, folder02] = await fakeFoldersRepository.createMany([
      {
        name: 'folder 1',
        description: 'This is the first folder',
      },
      {
        name: 'folder 2',
        description: 'This is the second folder',
      },
      {
        name: 'folder 3',
        description: 'This is the third folder',
      },
    ]);

    const folderList01 = await listFolderService.execute(connection, 1, 1, {});

    expect(folderList01.data).toEqual([folder01]);

    const folderList02 = await listFolderService.execute(connection, 1, 2, {});

    expect(folderList02.data).toEqual([folder01, folder02]);
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeFoldersRepository, 'findAll').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_LIST', 'Failed to list folders');
    });

    await expect(
      listFolderService.execute(connection, 1, 2, {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
