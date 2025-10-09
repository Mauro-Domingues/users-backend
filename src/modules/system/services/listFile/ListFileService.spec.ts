import { FakeFilesRepository } from '@modules/system/repositories/fakes/FakeFilesRepository';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { ListFileService } from './ListFileService';

let fakeFilesRepository: IFilesRepository;
let fakeCacheProvider: ICacheProvider;
let connection: IConnection;
let listFileService: ListFileService;

describe('ListFileService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listFileService = new ListFileService(
      fakeFilesRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to list all the files', async (): Promise<void> => {
    const [file01, file02] = await fakeFilesRepository.createMany([
      {
        name: 'file 1',
        description: 'This is the first file',
      },
      {
        name: 'file 2',
        description: 'This is the second file',
      },
    ]);

    const fileList = await listFileService.execute(connection, 1, 2, {});

    expect(fileList.data).toEqual([file01, file02]);
  });

  it('Should be able to list all the files using cache', async (): Promise<void> => {
    const [file01, file02] = await fakeFilesRepository.createMany([
      {
        name: 'file 1',
        description: 'This is the first file',
      },
      {
        name: 'file 2',
        description: 'This is the second file',
      },
    ]);

    await listFileService.execute(connection, 1, 2, {});

    const fileList = await listFileService.execute(connection, 1, 2, {});

    expect(fileList.data).toEqual(JSON.parse(JSON.stringify([file01, file02])));
  });

  it('Should be able to list the files with the specified pagination', async (): Promise<void> => {
    const [file01, file02] = await fakeFilesRepository.createMany([
      {
        name: 'file 1',
        description: 'This is the first file',
      },
      {
        name: 'file 2',
        description: 'This is the second file',
      },
      {
        name: 'file 3',
        description: 'This is the third file',
      },
    ]);

    const fileList01 = await listFileService.execute(connection, 1, 1, {});

    expect(fileList01.data).toEqual([file01]);

    const fileList02 = await listFileService.execute(connection, 1, 2, {});

    expect(fileList02.data).toEqual([file01, file02]);
  });

  it('Should return AppError', async (): Promise<void> => {
    jest.spyOn(fakeFilesRepository, 'findAll').mockImplementationOnce(() => {
      throw new AppError('FAILED_TO_LIST', 'Failed to list files');
    });

    await expect(
      listFileService.execute(connection, 1, 2, {}),
    ).rejects.toBeInstanceOf(AppError);
  });
});
