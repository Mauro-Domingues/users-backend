import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { Notification } from '@modules/system/entities/Notification';
import { ListNotificationService } from './ListNotificationService';

export class ListNotificationController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & Partial<Notification>
    >,
    response: Response<IListDTO<Notification>>,
  ): Promise<void> {
    const listNotification = container.resolve(ListNotificationService);

    const { page = 1, limit = 20, ...filters } = request.query;
    const userId = request.user?.sub;

    const notifications = await listNotification.execute(
      request.dbConnection,
      page,
      limit,
      filters,
      userId,
    );

    response.status(notifications.code).send(notifications);
  }
}
