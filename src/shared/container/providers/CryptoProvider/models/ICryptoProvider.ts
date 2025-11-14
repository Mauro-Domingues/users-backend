import type { SignOptions } from 'jsonwebtoken';
import type { JWK } from 'pem-jwk';
import type { IEncryptedDTO } from '../dtos/IEncryptedDTO';
import type { IJwtTokenDTO } from '../dtos/IJwtTokenDTO';
import type { IRefreshTokenDTO } from '../dtos/IRefreshTokenDTO';

export interface ICryptoProvider {
  encrypt(text: string): IEncryptedDTO;
  decrypt(hash: IEncryptedDTO): string;
  generateKeys(): JWK<{
    use: string;
  }>;
  generateRefreshToken(id: string): IRefreshTokenDTO;
  generateJwtToken<T extends object>(
    payload: T,
    options?: Omit<SignOptions, 'algorithm' | 'expiresIn'>,
  ): IJwtTokenDTO;
}
