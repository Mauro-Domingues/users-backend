import { AppError } from '@shared/errors/AppError';
import { FakeFilesRepository } from '@modules/systems/repositories/fakes/FakeFilesRepository';
import { IFilesRepository } from '@modules/systems/repositories/IFilesRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { ShowFileService } from './ShowFileService';

let fakeFilesRepository: IFilesRepository;
let connection: IConnection;
let showFileService: ShowFileService;

describe('ShowFileService', (): void => {
  beforeAll((): void => {
    connection = new Connection();
    connection.fakeConnect();
  });

  beforeEach((): void => {
    fakeFilesRepository = new FakeFilesRepository();
    showFileService = new ShowFileService(fakeFilesRepository);
  });

  it('Should be able to show a file', async (): Promise<void> => {
    const file = await fakeFilesRepository.create({
      name: 'file',
      description: 'This is a file',
    });

    const getFile = await showFileService.execute(connection, file.id);

    expect(getFile.data).toHaveProperty('id');
    expect(getFile.data).toEqual(file);
  });

  it('Should not be able to show a file with a non-existing id', async (): Promise<void> => {
    await expect(
      showFileService.execute(connection, 'non-existing-file-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
