import type { Notification } from '@modules/system/entities/Notification';
import type { User } from '@modules/users/entities/User';
import { getDetails } from './getDetails';

export function setNotification({
  reference,
  requester,
  action,
  type,
  user,
}: {
  reference?: Notification['referenceId'];
  action: Notification['action'];
  type: Notification['type'];
  requester?: User;
  user: User;
}): {
  title: string;
  content: string;
} {
  const { module, a, the, of } = getDetails(type);

  const userName = user?.profile?.fullName;
  const requesterName = requester?.profile?.fullName;

  const referenceText = reference ? ` com o código (${reference})` : '';

  const notification: Record<
    Notification['action'],
    {
      title: string;
      content: string;
    }
  > = {
    created: {
      title: `Você tem ${a} nov${the} ${module}`,
      content: (() => {
        const greeting = userName ? `${userName}, você` : 'Você';
        const reqText = requesterName
          ? ` ${the.toUpperCase()} ${module} foi solicitada por ${requesterName}`
          : '';
        return `${greeting} recebeu ${a} nov${the} ${module}${referenceText}.${reqText}`;
      })(),
    },
    updated: {
      title: `${the.toUpperCase()} ${module} foi atualizad${the}`,
      content: (() => {
        const greeting = userName ? `${userName}, ` : '';
        const reqText = requesterName
          ? ` A alteração ${of} ${module} foi solicitada por ${requesterName}`
          : '';
        return `${greeting}${the.toUpperCase()} ${module}${referenceText} foi atualizad${the}.${reqText}`;
      })(),
    },
    deleted: {
      title: `${the.toUpperCase()} ${module} foi cancelad${the}`,
      content: (() => {
        const greeting = userName ? `${userName}, ` : '';
        const reqText = requesterName
          ? ` O cancelamento ${of} ${module} foi solicitado por ${requesterName}`
          : '';
        return `${greeting}${the.toUpperCase()} ${module}${referenceText} foi cancelad${the}.${reqText}`;
      })(),
    },
  };

  return notification[action];
}
