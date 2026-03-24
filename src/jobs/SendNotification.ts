import type { DeepPartial, QueryRunner } from 'typeorm';
import { appConfig } from '@config/app';
import { cacheConfig } from '@config/cache';
import { notificationConfig } from '@config/notification';
import type { ISendNotificationDTO } from '@dtos/ISendNotificationDTO';
import type { Notification } from '@modules/system/entities/Notification';
import { FakeNotificationsRepository } from '@modules/system/repositories/fakes/FakeNotificationsRepository';
import type { INotificationsRepository } from '@modules/system/repositories/INotificationsRepository';
import { NotificationsRepository } from '@modules/system/repositories/NotificationsRepository';
import type { User } from '@modules/users/entities/User';
import { FakeTokensRepository } from '@modules/users/repositories/fakes/FakeTokensRepository';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { TokensRepository } from '@modules/users/repositories/TokensRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { RedisCacheProvider } from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeNotificationProvider } from '@shared/container/providers/NotificationProvider/fakes/FakeNotificationProvider';
import { FirebaseProvider } from '@shared/container/providers/NotificationProvider/implementations/FirebaseProvider';
import { OneSignalProvider } from '@shared/container/providers/NotificationProvider/implementations/OneSignalProvider';
import type { INotificationProvider } from '@shared/container/providers/NotificationProvider/models/INotificationProvider';
import { Connection } from '@shared/typeorm';
import { setNotification } from '@utils/notification/setNotification';

const repositories: {
  users: Record<typeof appConfig.config.apiMode, () => IUsersRepository>;
  tokens: Record<typeof appConfig.config.apiMode, () => ITokensRepository>;
  notifications: Record<
    typeof appConfig.config.apiMode,
    () => INotificationsRepository
  >;
} = {
  users: {
    test: () => new FakeUsersRepository(),
    development: () => new UsersRepository(),
    production: () => new UsersRepository(),
  },
  tokens: {
    test: () => new FakeTokensRepository(),
    development: () => new TokensRepository(),
    production: () => new TokensRepository(),
  },
  notifications: {
    test: () => new FakeNotificationsRepository(),
    development: () => new NotificationsRepository(),
    production: () => new NotificationsRepository(),
  },
};

const providers: {
  notification: Record<
    typeof notificationConfig.driver | 'test',
    () => INotificationProvider
  >;
  cache: Record<typeof cacheConfig.driver | 'test', () => ICacheProvider>;
} = {
  notification: {
    firebase: () => new FirebaseProvider(),
    onesignal: () => new OneSignalProvider(),
    test: () => new FakeNotificationProvider(),
  },
  cache: {
    redis: () => new RedisCacheProvider(),
    test: () => new FakeCacheProvider(),
  },
};

export class SendNotification {
  private readonly notificationsRepository: INotificationsRepository;

  private readonly notificationProvider: INotificationProvider;

  private readonly usersRepository: IUsersRepository;

  private readonly tokensRepository: ITokensRepository;

  private readonly cacheProvider: ICacheProvider;

  public constructor() {
    this.usersRepository = repositories.users[appConfig.config.apiMode]();
    this.notificationsRepository =
      repositories.notifications[appConfig.config.apiMode]();
    this.notificationProvider =
      providers.notification[
        appConfig.config.apiMode === 'test' ? 'test' : notificationConfig.driver
      ]();
    this.cacheProvider =
      providers.cache[
        appConfig.config.apiMode === 'test' ? 'test' : cacheConfig.driver
      ]();
  }

  public static get key(): Capitalize<string> {
    return 'SendNotification';
  }

  private async getUsers({
    userCondition,
    requesterId,
    trx,
  }: {
    userCondition: ISendNotificationDTO['data']['userCondition'];
    requesterId?: string;
    trx: QueryRunner;
  }): Promise<{
    users: Array<User & { deviceIds: Array<string> }>;
    requester: User | undefined;
  }> {
    const { list: users } = await this.usersRepository.findAll(
      {
        where: userCondition,
        relations: { profile: true },
        select: { id: true, profile: { fullName: true } },
      },
      trx,
    );

    const tokens = await this.tokensRepository.findIn(
      {
        where: { userId: users.map(user => user.id) },
        select: { deviceId: true, userId: true },
      },
      trx,
    );

    users.forEach(user => {
      const userTokens = tokens.filter(token => token.userId === user.id);
      Object.assign(user, {
        deviceIds: userTokens.map(token => token.deviceId),
      });
    });

    const requester =
      requesterId &&
      (await this.usersRepository.findBy(
        {
          where: { id: requesterId },
          relations: { profile: true },
          select: { id: true, profile: { fullName: true } },
        },
        trx,
      ));

    return {
      users: users as Array<User & { deviceIds: Array<string> }>,
      requester: requester || undefined,
    };
  }

  private iterateData({
    requester,
    client,
    users,
    rest,
  }: {
    rest: Omit<ISendNotificationDTO['data'], 'userCondition'>;
    requester: User | undefined;
    users: Array<User & { deviceIds: Array<string> }>;
    client: string;
  }): {
    notificationsToCreate: Array<DeepPartial<Notification>>;
    cacheKeysToInvalidate: Array<Promise<void>>;
    notificationsToSend: Array<Promise<void>>;
  } {
    return users.reduce<{
      notificationsToCreate: Array<DeepPartial<Notification>>;
      cacheKeysToInvalidate: Array<Promise<void>>;
      notificationsToSend: Array<Promise<void>>;
    }>(
      (acc, user) => {
        const { title, content } = setNotification({
          reference: rest.referenceId,
          action: rest.action,
          type: rest.type,
          requester,
          user,
        });

        acc.notificationsToCreate.push({ ...rest, title, content, user });
        acc.cacheKeysToInvalidate.push(
          this.cacheProvider.invalidatePrefix(
            `${client}:notifications:${user.id}`,
          ),
        );

        if (user.deviceIds?.length) {
          acc.notificationsToSend.push(
            this.notificationProvider.sendNotification({
              deviceIds: user.deviceIds,
              header: title,
              content,
            }),
          );
        }

        return acc;
      },
      {
        notificationsToCreate: [],
        cacheKeysToInvalidate: [],
        notificationsToSend: [],
      },
    );
  }

  public async handle({
    data: {
      client,
      data: { userCondition, ...rest },
    },
  }: {
    data: ISendNotificationDTO;
  }): Promise<void> {
    const dbConnection = new Connection(client);
    await dbConnection.connect();
    const { mysql } = dbConnection;

    const trx = mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const { requester, users } = await this.getUsers({
        requesterId: rest.requesterId,
        userCondition,
        trx,
      });

      const {
        notificationsToCreate,
        notificationsToSend,
        cacheKeysToInvalidate,
      } = this.iterateData({ client, requester, rest, users });

      await this.notificationsRepository.createMany(notificationsToCreate, trx);

      await Promise.all(cacheKeysToInvalidate);
      await Promise.allSettled(notificationsToSend);

      if (trx.isTransactionActive) await trx.commitTransaction();
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
