import { compare, hash } from 'bcrypt';
import { hashConfig } from '@config/hash';
import type { IHashProvider } from '../models/IHashProvider';

export class BcryptProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, hashConfig.config.salt);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
