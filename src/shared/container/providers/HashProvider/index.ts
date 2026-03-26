import { container } from 'tsyringe';
import { hashConfig } from '@config/hash';
import { BcryptProvider } from './implementations/BcryptProvider';
import type { IHashProvider } from './models/IHashProvider';

const providers: Record<typeof hashConfig.driver, () => IHashProvider> = {
  bcrypt: () => container.resolve(BcryptProvider),
};

container.registerInstance<IHashProvider>(
  'HashProvider',
  providers[hashConfig.driver](),
);
