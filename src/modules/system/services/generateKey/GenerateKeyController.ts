import type { Request, Response } from 'express';
import type { JWK } from 'pem-jwk';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
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

    response.status(generatedKey.code).json(generatedKey);
  }
}
