import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import { ListAppointmentService } from './ListAppointmentService';

export class ListAppointmentController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & Partial<Appointment>
    >,
    response: Response<IListDTO<Appointment>>,
  ): Promise<void> {
    const listAppointment = container.resolve(ListAppointmentService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const appointments = await listAppointment.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(appointments.code).json(appointments);
  }
}
