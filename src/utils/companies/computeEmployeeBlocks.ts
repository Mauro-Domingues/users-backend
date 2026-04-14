import type { IScheduleDTO } from '@modules/companies/dtos/IScheduleDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import { isSameDay } from './isSameDay';
import { subtractInterval } from './subtractInterval';
import { timeToMinutes } from './timeToMinutes';

export function computeEmployeeBlocks({
  appointments = [],
  toleranceMinutes,
  targetDate,
  dayConfig,
  employee,
}: {
  dayConfig: NonNullable<IScheduleDTO[keyof IScheduleDTO]>;
  appointments: Array<Appointment>;
  employee: { id: string };
  toleranceMinutes: number;
  targetDate: Date;
}): Array<{ start: number; end: number }> {
  const initialBlocks = [
    {
      start: timeToMinutes(dayConfig.workHours.start),
      end: timeToMinutes(dayConfig.workHours.end),
    },
  ];

  const afterBreaks = dayConfig.breaks.reduce((blocks, breakPeriod) => {
    return subtractInterval({
      sourceIntervals: blocks,
      removeStart: timeToMinutes(breakPeriod.start),
      removeEnd: timeToMinutes(breakPeriod.end),
    });
  }, initialBlocks);

  const dayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.datetime);
    return (
      appointment.employeeId === employee.id &&
      isSameDay(appointmentDate, targetDate)
    );
  });

  return dayAppointments.reduce((blocks, appointment) => {
    const appointmentDate = new Date(appointment.datetime);
    const appointmentStart =
      appointmentDate.getHours() * 60 + appointmentDate.getMinutes();
    const appointmentEnd =
      appointmentStart + appointment.durationInMinutes + toleranceMinutes;

    return subtractInterval({
      sourceIntervals: blocks,
      removeStart: appointmentStart,
      removeEnd: appointmentEnd,
    });
  }, afterBreaks);
}
