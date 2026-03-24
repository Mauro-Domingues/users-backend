import { Notification } from '@modules/system/entities/Notification';

export function getDetails(type: Notification['type']): {
  module: string;
  the: string;
  a: string;
  of: string;
  on: string;
} {
  const modules: Record<
    Notification['type'],
    { module: string; the: string; a: string; of: string; on: string }
  > = {
    schedule: { module: 'Agendamento', a: 'um', of: 'do', on: 'no', the: 'o' },
  };

  return modules[type];
}
