import { container } from 'tsyringe';
import { cacheConfig } from '@config/cache';
import { RedisProvider } from './implementations/RedisProvider';
import type { ICacheProvider } from './models/ICacheProvider';

const providers: Record<typeof cacheConfig.driver, () => ICacheProvider> = {
  redis: () => container.resolve(RedisProvider),
};

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  providers[cacheConfig.driver](),
);
