import { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { JWK } from 'pem-jwk';
import { injectable, inject } from 'tsyringe';
import { Get, Route, Tags } from 'tsoa';
import { IResponseDTO } from '@dtos/IResponseDTO';

@Route('/generate-keys')
@injectable()
export class GenerateKeyService {
  public constructor(
    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProvider,
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
    const generatedKey = this.cryptoProvider.generateKeys();

    return {
      code: 201,
      messageCode: 'GENERATED',
      message: 'Files successfully generated',
      data: generatedKey,
    };
  }
}
