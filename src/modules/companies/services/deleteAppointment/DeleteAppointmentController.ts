import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAppointmentDTO } from '@modules/companies/dtos/IAppointmentDTO';
import { DeleteAppointmentService } from './DeleteAppointmentService';

export class DeleteAppointmentController {
  public async handle(
    request: Request<Required<IAppointmentDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteAppointment = container.resolve(DeleteAppointmentService);

    const { id } = request.params;

    const appointment = await deleteAppointment.execute(
      request.dbConnection,
      id,
    );

    response.sendStatus(appointment.code);
  }
}
