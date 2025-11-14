import { Folder } from '@modules/system/entities/Folder';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class FoldersRepository
  extends BaseRepository<Folder>
  implements IFoldersRepository
{
  public constructor() {
    super(Folder);
  }

  // non-generic methods here
}
