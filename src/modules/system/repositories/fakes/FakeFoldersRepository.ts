import { Folder } from '@modules/system/entities/Folder';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeFoldersRepository
  extends FakeBaseRepository<Folder>
  implements IFoldersRepository
{
  public constructor() {
    super(Folder);
  }

  // non-generic methods here
}
