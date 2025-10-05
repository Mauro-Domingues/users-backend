import { File } from '@modules/system/entities/File';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class FilesRepository
  extends BaseRepository<File>
  implements IFilesRepository
{
  public constructor() {
    super(File);
  }

  // non-generic methods here
}
