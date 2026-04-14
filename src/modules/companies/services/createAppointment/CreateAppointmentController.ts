import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAppointmentDTO } from '@modules/companies/dtos/IAppointmentDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import { CreateAppointmentService } from './CreateAppointmentService';

export class CreateAppointmentController {
  public async handle(
    request: Request<never, never, IAppointmentDTO>,
    response: Response<IResponseDTO<Appointment>>,
  ): Promise<void> {
    const appointmentData = request.body;
    appointmentData.companyId ??= request.user?.sub;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute(
      request.dbConnection,
      appointmentData,
    );

    response.status(appointment.code).json(appointment);
  }
}
