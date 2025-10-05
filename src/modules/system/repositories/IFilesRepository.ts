import { File } from '@modules/system/entities/File';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IFilesRepository extends IBaseRepository<File> {
  // non-generic methods here
}
