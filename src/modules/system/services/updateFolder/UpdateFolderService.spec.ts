import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeFoldersRepository } from '@modules/system/repositories/fakes/FakeFoldersRepository';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { UpdateFolderService } from './UpdateFolderService';

let fakeFoldersRepository: IFoldersRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let updateFolderService: UpdateFolderService;

describe('UpdateFolderService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFoldersRepository = new FakeFoldersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateFolderService = new UpdateFolderService(
      fakeFoldersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to update a folder', async (): Promise<void> => {
    const folder = await fakeFoldersRepository.create({
      name: 'folder',
      description: 'This is a folder',
    });

    const updatedFolder = await updateFolderService.execute(
      connection,
      folder.id,
      {
        ...folder,
        name: 'updatedFolder',
      },
    );

    expect(updatedFolder.data.name).toEqual('updatedFolder');
  });

  it('Should not be able to update a folder with a non-existing id', async (): Promise<void> => {
    await expect(
      updateFolderService.execute(connection, 'non-existing-folder-id', {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
