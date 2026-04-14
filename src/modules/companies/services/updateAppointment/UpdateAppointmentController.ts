import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAppointmentDTO } from '@modules/companies/dtos/IAppointmentDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import { UpdateAppointmentService } from './UpdateAppointmentService';

export class UpdateAppointmentController {
  public async handle(
    request: Request<Required<IAppointmentDTO>, never, IAppointmentDTO>,
    response: Response<IResponseDTO<Appointment>>,
  ): Promise<void> {
    const updateAppointment = container.resolve(UpdateAppointmentService);

    const { id } = request.params;
    const appointmentData = request.body;

    const appointment = await updateAppointment.execute(
      request.dbConnection,
      id,
      appointmentData,
    );

    response.status(appointment.code).json(appointment);
  }
}
