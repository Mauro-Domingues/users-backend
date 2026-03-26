import type { JWK } from 'pem-jwk';
import { Get, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IEncryptionProvider } from '@shared/container/providers/EncryptionProvider/models/IEncryptionProvider';

@Route('/generate-keys')
@injectable()
export class GenerateKeyService {
  public constructor(
    @inject('EncryptionProvider')
    private readonly encryptionProvider: IEncryptionProvider,
  ) {}

  @Get()
  @Tags('System')
  public async execute(): Promise<
    IResponseDTO<
      JWK<{
        use: string;
      }>
    >
  > {
    const generatedKey = this.encryptionProvider.generateKeys();

    return {
      code: 201,
      messageCode: 'GENERATED',
      message: 'Files successfully generated',
      data: generatedKey,
    };
  }
}
