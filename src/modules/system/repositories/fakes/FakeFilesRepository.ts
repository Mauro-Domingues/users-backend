import { File } from '@modules/system/entities/File';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeFilesRepository
  extends FakeBaseRepository<File>
  implements IFilesRepository
{
  public constructor() {
    super(File);
  }

  // non-generic methods here
}
