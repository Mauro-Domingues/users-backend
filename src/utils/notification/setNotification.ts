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

  const notification: Record<
    Notification['action'],
    {
      title: string;
      content: string;
    }
  > = {
    created: {
      title: `Você tem ${a} nov${the} ${module}`,
      content: `${
        user?.profile?.fullName ? `${user?.profile?.fullName}, você` : 'Você'
      } recebeu ${a} nov${the} ${module}${reference ? ` com o código (${reference})` : ''}. ${requester?.profile?.fullName ? `${the.toUpperCase()} ${module} foi solicitada por ${requester?.profile?.fullName}` : ''}`,
    },
    updated: {
      title: `${the.toUpperCase()} ${module} foi atualizad${the}`,
      content: `${
        user?.profile?.fullName ? `${user?.profile?.fullName},` : ''
      } ${the.toUpperCase()} ${module}${reference ? ` com o código (${reference})` : ''} foi atualizad${the}. ${requester?.profile?.fullName ? `A alteração ${of} ${module} foi solicitada por ${requester?.profile?.fullName}` : ''}`,
    },
    deleted: {
      title: `${the.toUpperCase()} ${module} foi cancelad${the}`,
      content: `${
        user?.profile?.fullName ? `${user?.profile?.fullName},` : ''
      } ${the.toUpperCase()} ${module}${reference ? ` com o código (${reference})` : ''} foi cancelad${the}. ${requester?.profile?.fullName ? `O cancelamento ${of} ${module} foi solicitado por ${requester?.profile?.fullName}` : ''}`,
    },
  };

  return notification[action];
}
