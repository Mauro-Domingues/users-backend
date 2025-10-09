import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeFilesRepository } from '@modules/system/repositories/fakes/FakeFilesRepository';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { CreateFileService } from './CreateFileService';

let fakeFilesRepository: IFilesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let createFileService: CreateFileService;

describe('CreateFileService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createFileService = new CreateFileService(
      fakeFilesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new file', async (): Promise<void> => {
    const file = await createFileService.execute(connection, {
      name: 'file',
      description: 'This is a file',
    });

    expect(file.data).toHaveProperty('id');
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeFilesRepository, 'create').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_CREATE', 'Failed to create a file');
    });

    await expect(
      createFileService.execute(connection, {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
