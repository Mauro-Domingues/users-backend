import { container } from 'tsyringe';
import { cryptoConfig } from '@config/crypto';
import { CryptoProvider } from './implementations/CryptoProvider';
import type { ICryptoProvider } from './models/ICryptoProvider';

const providers: Record<typeof cryptoConfig.driver, () => ICryptoProvider> = {
  crypto: () => container.resolve(CryptoProvider),
};

container.registerInstance<ICryptoProvider>(
  'CryptoProvider',
  providers[cryptoConfig.driver](),
);
