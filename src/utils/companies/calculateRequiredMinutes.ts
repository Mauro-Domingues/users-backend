import type { Service } from '@modules/companies/entities/Service';

export function calculateRequiredMinutes({
  toleranceMinutes,
  services = [],
  serviceId,
}: {
  serviceId: string | undefined;
  toleranceMinutes: number;
  services: Array<Service>;
}): number {
  if (serviceId) {
    const targetService = services.find(s => s.id === serviceId);
    return targetService
      ? targetService.durationInMinutes + toleranceMinutes
      : 0;
  }
  if (services.length > 0) {
    const minDuration = Math.min(...services.map(s => s.durationInMinutes));
    return minDuration + toleranceMinutes;
  }
  return 0;
}
