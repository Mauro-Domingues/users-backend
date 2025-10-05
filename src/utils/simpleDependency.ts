import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
} from 'typeorm';

export abstract class SimpleDependency {
  protected readonly filesRepository: IFilesRepository;

  protected readonly storageProvider: IStorageProvider;

  protected async createOrUpdateEntity<
    Target extends ObjectLiteral,
    Reference extends keyof Target & string,
    Repository extends IBaseRepository<ObjectLiteral & Target[keyof Target]>,
  >({
    repository,
    reference,
    target,
    entity,
    trx,
  }: {
    entity: Target[Reference];
    repository: Repository;
    reference: Reference;
    trx: QueryRunner;
    target: Target;
  }): Promise<Target[Reference]> {
    const existingEntity =
      target[`${reference}Id`] &&
      (await repository.findBy(
        {
          where: {
            id: target[`${reference}Id` as const],
          },
          select: { id: true },
        } as FindOneOptions<unknown>,
        trx,
      ));

    if (!existingEntity) {
      target[reference] = await repository.create(entity, trx);
    } else {
      target[reference] = repository.update(
        { ...existingEntity, ...entity },
        trx,
      ) as Target[Reference];
    }

    return target[reference];
  }

  private compareReferences<T extends ObjectLiteral>({
    reference = 'id',
    prev,
    curr,
  }: {
    reference: keyof T | undefined;
    prev: T;
    curr: T;
  }): boolean {
    return prev?.[reference] === curr?.[reference];
  }

  protected async createOrUpdateEntityArray<
    Target extends ObjectLiteral,
    Entities extends Target[keyof Target],
    Repository extends IBaseRepository<ObjectLiteral>,
  >({
    filterTargetReference,
    targetReference,
    repository,
    entities,
    target,
    trx,
  }: {
    filterTargetReference?: keyof Entities[number];
    targetReference: keyof Entities[number];
    repository: Repository;
    entities: Entities;
    trx: QueryRunner;
    target: Target;
  }): Promise<void> {
    const { list } = await repository.findAll(
      {
        where: {
          [targetReference]: target.id,
        },
        select: {
          id: true,
          [targetReference]: true,
          ...(filterTargetReference && {
            [filterTargetReference]: true,
          }),
        },
      } as unknown as FindManyOptions<ObjectLiteral>,
      trx,
    );

    const { referencesToCreate, referencesToUpdate } = (
      entities as Array<Entities[number]>
    ).reduce<{
      referencesToCreate: Array<DeepPartial<Entities[number]>>;
      referencesToUpdate: Array<DeepPartial<Entities[number]>>;
    }>(
      (acc, entity) => {
        entity[targetReference] = target.id;

        const referenceIndex = list.find(
          reference =>
            this.compareReferences({
              prev: reference,
              curr: entity,
              reference: targetReference as keyof ObjectLiteral,
            }) &&
            this.compareReferences({
              prev: reference,
              curr: entity,
              reference: filterTargetReference as keyof ObjectLiteral,
            }),
        );

        if (referenceIndex) {
          acc.referencesToUpdate.push({ ...referenceIndex, ...entity });
        } else {
          acc.referencesToCreate.push({
            ...entity,
            [targetReference]: target.id,
          });
        }

        return acc;
      },
      {
        referencesToCreate: [],
        referencesToUpdate: [],
      },
    );

    const referencesToDelete: Array<ObjectLiteral> = list.filter(
      existingReference =>
        entities.findIndex(
          (entity: Entities[number]) =>
            this.compareReferences({
              prev: entity,
              curr: existingReference,
              reference: targetReference,
            }) &&
            this.compareReferences({
              prev: entity,
              curr: existingReference,
              reference: filterTargetReference,
            }),
        ) === -1,
    );

    if (referencesToCreate.length) {
      await repository.createMany(referencesToCreate, trx);
    }

    if (referencesToUpdate.length) {
      await repository.updateMany(referencesToUpdate, trx);
    }

    if (referencesToDelete.length) {
      await repository.deleteMany(
        referencesToDelete.map(referenceToDelete => ({
          id: referenceToDelete.id,
        })),
        trx,
      );
    }
  }

  protected async patchFile<Entity>({
    trx,
    data,
    target,
    field,
  }: {
    field: keyof Entity;
    trx: QueryRunner;
    target: Entity;
    data: Entity;
  }): Promise<void> {
    const file = await this.filesRepository.findBy(
      {
        where: {
          id: data[field] as string,
        },
        select: { id: true },
      },
      trx,
    );

    if (file) {
      if (target[field] && target[field] !== file.id) {
        const existingFile = await this.filesRepository.findBy(
          {
            where: {
              id: target[field] as string,
            },
            select: { id: true, file: true },
          },
          trx,
        );

        if (existingFile) {
          await this.storageProvider.deleteFile(existingFile.file);
          await this.filesRepository.delete({ id: existingFile.id }, trx);
        }
      }
    }
  }
}
