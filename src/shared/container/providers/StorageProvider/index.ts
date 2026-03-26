import { container } from 'tsyringe';
import { storageConfig } from '@config/storage';
import { DiskProvider } from './implementations/DiskProvider';
import { S3Provider } from './implementations/S3Provider';
import type { IStorageProvider } from './models/IStorageProvider';

const providers: Record<typeof storageConfig.driver, () => IStorageProvider> = {
  disk: () => container.resolve(DiskProvider),
  s3: () => container.resolve(S3Provider),
};

container.registerInstance<IStorageProvider>(
  'StorageProvider',
  providers[storageConfig.driver](),
);
