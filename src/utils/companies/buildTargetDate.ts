export function buildTargetDate(baseDate: Date, offset: number): Date {
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + offset);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate;
}
