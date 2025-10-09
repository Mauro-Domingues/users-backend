import { AppError } from '@shared/errors/AppError';
import { FakeFoldersRepository } from '@modules/system/repositories/fakes/FakeFoldersRepository';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { ShowFolderService } from './ShowFolderService';

let fakeFoldersRepository: IFoldersRepository;
let connection: IConnection;
let showFolderService: ShowFolderService;

describe('ShowFolderService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFoldersRepository = new FakeFoldersRepository();
    showFolderService = new ShowFolderService(fakeFoldersRepository);
  });

  it('Should be able to show a folder', async (): Promise<void> => {
    const folder = await fakeFoldersRepository.create({
      name: 'folder',
      description: 'This is a folder',
    });

    const getFolder = await showFolderService.execute(connection, folder.id);

    expect(getFolder.data).toHaveProperty('id');
    expect(getFolder.data).toEqual(folder);
  });

  it('Should not be able to show a folder with a non-existing id', async (): Promise<void> => {
    await expect(
      showFolderService.execute(connection, 'non-existing-folder-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
