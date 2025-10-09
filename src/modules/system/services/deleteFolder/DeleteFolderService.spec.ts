import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeFoldersRepository } from '@modules/systems/repositories/fakes/FakeFoldersRepository';
import { IFoldersRepository } from '@modules/systems/repositories/IFoldersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { DeleteFolderService } from './DeleteFolderService';

let fakeFoldersRepository: IFoldersRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let deleteFolderService: DeleteFolderService;

describe('DeleteFolderService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFoldersRepository = new FakeFoldersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteFolderService = new DeleteFolderService(
      fakeFoldersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to delete a folder', async (): Promise<void> => {
    const folder = await fakeFoldersRepository.create({
      name: 'folder',
      description: 'This is a folder',
    });

    await deleteFolderService.execute(connection, folder.id);

    const deletedFolder = await fakeFoldersRepository.findBy({
      where: {
        id: folder.id,
      },
    });

    expect(deletedFolder).toBe(null);
  });

  it('Should not be able to delete a folder with a non-existing id', async (): Promise<void> => {
    await expect(
      deleteFolderService.execute(connection, 'non-existing-folder-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
