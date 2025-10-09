import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { Folder } from '@modules/system/entities/Folder';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Get, Route, Tags, Path, Inject } from 'tsoa';

@Route('/folders')
@injectable()
export class ShowFolderService {
  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,
  ) {}

  @Get('{id}')
  @Tags('Folder')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<Folder>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const folder = await this.foldersRepository.findBy(
        {
          where: { id },
          select: {
            id: true,
            name: true,
            slug: true,
            files: { id: true, file: true },
          },
        },
        trx,
      );

      if (!folder) {
        throw new AppError('NOT_FOUND', 'Folder not found', 404);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'Folder found successfully',
        data: instanceToInstance(folder),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
