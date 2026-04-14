import type { IScheduleDTO } from '@modules/companies/dtos/IScheduleDTO';
import { timeToMinutes } from './timeToMinutes';

export function computeCurrentState(
  baseDate: Date,
  schedule: IScheduleDTO,
): 'open' | 'closed' {
  const currentDayIdx = baseDate.getDay().toString() as keyof IScheduleDTO;
  const todayConfig = schedule?.[currentDayIdx];
  const currentTimeMinutes = baseDate.getHours() * 60 + baseDate.getMinutes();

  if (!todayConfig) return 'closed';

  const workStart = timeToMinutes(todayConfig.workHours.start);
  const workEnd = timeToMinutes(todayConfig.workHours.end);

  if (currentTimeMinutes < workStart || currentTimeMinutes >= workEnd)
    return 'closed';

  const isInBreak = todayConfig.breaks.some(b => {
    const bStart = timeToMinutes(b.start);
    const bEnd = timeToMinutes(b.end);
    return currentTimeMinutes >= bStart && currentTimeMinutes < bEnd;
  });

  return isInBreak ? 'closed' : 'open';
}
