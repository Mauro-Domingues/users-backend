import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import { FakeFilesRepository } from '@modules/system/repositories/fakes/FakeFilesRepository';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { UpdateFileService } from './UpdateFileService';

let fakeFilesRepository: IFilesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let updateFileService: UpdateFileService;

describe('UpdateFileService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateFileService = new UpdateFileService(
      fakeFilesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to update a file', async (): Promise<void> => {
    const file = await fakeFilesRepository.create({
      name: 'file',
      description: 'This is a file',
    });

    const updatedFile = await updateFileService.execute(connection, file.id, {
      ...file,
      name: 'updatedFile',
    });

    expect(updatedFile.data.name).toEqual('updatedFile');
  });

  it('Should not be able to update a file with a non-existing id', async (): Promise<void> => {
    await expect(
      updateFileService.execute(connection, 'non-existing-file-id', {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
