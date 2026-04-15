import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { INotificationDTO } from '@modules/system/dtos/INotificationDTO';
import { DeleteNotificationService } from './DeleteNotificationService';

export class DeleteNotificationController {
  public async handle(
    request: Request<Required<INotificationDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteNotification = container.resolve(DeleteNotificationService);

    const { id } = request.params;

    const notification = await deleteNotification.execute(
      request.dbConnection,
      id,
    );

    response.sendStatus(notification.code);
  }
}
