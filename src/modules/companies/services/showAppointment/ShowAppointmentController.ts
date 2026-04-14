import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAppointmentDTO } from '@modules/companies/dtos/IAppointmentDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import { ShowAppointmentService } from './ShowAppointmentService';

export class ShowAppointmentController {
  public async handle(
    request: Request<Required<IAppointmentDTO>>,
    response: Response<IResponseDTO<Appointment>>,
  ): Promise<void> {
    const showAppointment = container.resolve(ShowAppointmentService);

    const { id } = request.params;

    const appointment = await showAppointment.execute(request.dbConnection, id);

    response.status(appointment.code).json(appointment);
  }
}
