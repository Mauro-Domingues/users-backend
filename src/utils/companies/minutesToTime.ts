export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = Math.floor(minutes % 60);
  return `${hours.toString().padStart(2, '0')}:${minutesRemaining.toString().padStart(2, '0')}`;
}
