export function isSameDay(referenceDate: Date, comparisonDate: Date): boolean {
  return (
    referenceDate.getFullYear() === comparisonDate.getFullYear() &&
    referenceDate.getMonth() === comparisonDate.getMonth() &&
    referenceDate.getDate() === comparisonDate.getDate()
  );
}
