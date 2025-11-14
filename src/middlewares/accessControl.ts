import type { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { Permission } from '@modules/users/entities/Permission';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';
import { slugify } from '@utils/slugify';

const getMethod: Record<
  string,
  (path: string) => 'show' | 'list' | 'update' | 'create' | 'delete' | 'patch'
> = {
  GET: path => (/\/:\w+\/?/.test(path) ? 'show' : 'list'),
  POST: () => 'create',
  PUT: () => 'update',
  DELETE: () => 'delete',
  PATCH: () => 'patch',
};

const cacheProvider = container.resolve<ICacheProvider>('CacheProvider');

const getPermissions = async ({
  connection,
  userId,
}: {
  connection: IConnection;
  userId: string;
}): Promise<Set<string>> => {
  const cacheKey = `${connection.client}:users:${userId}:permissions`;

  let cache = await cacheProvider.recovery<Array<string>>(cacheKey);

  if (!cache) {
    const permissions = await connection.mysql.manager.find(Permission, {
      where: { users: { id: userId } },
      select: {
        slug: true,
      },
    });

    cache = permissions.map(permission => permission.slug);
    await cacheProvider.save(cacheKey, cache);
  }

  return new Set(cache);
};

export const accessControl = async (
  request: Request<unknown>,
  _response: Response<unknown>,
  next: NextFunction,
): Promise<unknown> => {
  const { path } = request.route;
  const method = getMethod[request.method](path);

  const permissions = await getPermissions({
    connection: request.dbConnection,
    userId: request.user.sub,
  });

  if (permissions.has(`${slugify(path)}___${method}`)) {
    return next();
  }

  throw new AppError('FORBIDDEN', 'You do not have access to this route', 403);
};
