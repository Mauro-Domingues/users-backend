import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeFilesRepository } from '@modules/systems/repositories/fakes/FakeFilesRepository';
import { IFilesRepository } from '@modules/systems/repositories/IFilesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { DeleteFileService } from './DeleteFileService';

let fakeFilesRepository: IFilesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let deleteFileService: DeleteFileService;

describe('DeleteFileService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteFileService = new DeleteFileService(
      fakeFilesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to delete a file', async (): Promise<void> => {
    const file = await fakeFilesRepository.create({
      name: 'file',
      description: 'This is a file',
    });

    await deleteFileService.execute(connection, file.id);

    const deletedFile = await fakeFilesRepository.findBy({
      where: {
        id: file.id,
      },
    });

    expect(deletedFile).toBe(null);
  });

  it('Should not be able to delete a file with a non-existing id', async (): Promise<void> => {
    await expect(
      deleteFileService.execute(connection, 'non-existing-file-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
