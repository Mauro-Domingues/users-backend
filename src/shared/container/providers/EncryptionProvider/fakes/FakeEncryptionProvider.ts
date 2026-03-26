import type { JWK } from 'pem-jwk';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { encryptionConfig } from '@config/encryption';
import { convertToMilliseconds } from '@utils/convertToMilliseconds';
import type { IEncryptedDTO } from '../dtos/IEncryptedDTO';
import type { IJwtTokenDTO } from '../dtos/IJwtTokenDTO';
import type { IRefreshTokenDTO } from '../dtos/IRefreshTokenDTO';
import type { IEncryptionProvider } from '../models/IEncryptionProvider';

export class FakeEncryptionProvider implements IEncryptionProvider {
  public encrypt(text: string): IEncryptedDTO {
    return {
      iv: 'base64',
      content: Buffer.from(text).toString('base64'),
    };
  }

  public decrypt({ content }: IEncryptedDTO): string {
    return Buffer.from(content, 'base64').toString('utf-8');
  }

  public generateRefreshToken(id: string): IRefreshTokenDTO {
    const token = createHash('sha256').update(id).digest('hex');

    return { type: 'sha256', token };
  }

  public generateJwtToken<T extends object>(payload: T): IJwtTokenDTO {
    const expiresIn = convertToMilliseconds(
      encryptionConfig.config.crypto.jwtLifetime,
    );

    const token = Buffer.from(
      JSON.stringify({
        exp: Math.floor((Date.now() + expiresIn) / 1000),
        ...payload,
      }),
    ).toString('base64');

    return { token, type: 'Bearer', expiresIn };
  }

  public generateKeys(): JWK<{ use: string }> {
    const publicKey = readFileSync(
      resolve(encryptionConfig.config.keysPath, 'public.pem'),
      { encoding: 'base64' },
    );

    return {
      kty: 'RSA',
      n: publicKey,
      e: 'AQAB',
      use: 'sig',
    };
  }
}
