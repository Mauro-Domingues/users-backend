import type { User } from '@modules/users/entities/User';

export function getName(user: User): string | undefined {
  return user?.profile?.fullName?.trim();
}
