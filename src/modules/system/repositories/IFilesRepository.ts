import type { File } from '@modules/system/entities/File';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IFilesRepository extends IBaseRepository<File> {
  // non-generic methods here
}
