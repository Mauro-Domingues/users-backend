import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { JWK } from 'pem-jwk';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { GenerateKeyService } from './GenerateKeyService';

export class GenerateKeyControllerController {
  public async handle(
    _request: Request,
    response: Response<
      IResponseDTO<
        JWK<{
          use: string;
        }>
      >
    >,
  ): Promise<void> {
    const generateKeyController = container.resolve(GenerateKeyService);

    const generatedKey = await generateKeyController.execute();

    response.status(generatedKey.code).send(generatedKey);
  }
}
