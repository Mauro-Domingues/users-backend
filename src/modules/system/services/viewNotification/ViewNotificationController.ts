import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { INotificationDTO } from '@modules/system/dtos/INotificationDTO';
import { ViewNotificationService } from './ViewNotificationService';

export class ViewNotificationController {
  public async handle(
    request: Request<Required<INotificationDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const viewNotification = container.resolve(ViewNotificationService);

    const { id } = request.params;
    const userId = request.user?.sub;

    const notification = await viewNotification.execute(
      request.dbConnection,
      id,
      userId,
    );

    response.status(notification.code).json(notification);
  }
}
