import { container } from 'tsyringe';
import { encryptionConfig } from '@config/encryption';
import { CryptoProvider } from './implementations/CryptoProvider';
import type { IEncryptionProvider } from './models/IEncryptionProvider';

const providers: Record<
  typeof encryptionConfig.driver,
  () => IEncryptionProvider
> = {
  encryption: () => container.resolve(CryptoProvider),
};

container.registerInstance<IEncryptionProvider>(
  'EncryptionProvider',
  providers[encryptionConfig.driver](),
);
