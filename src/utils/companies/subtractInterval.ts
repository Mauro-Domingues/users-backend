export function subtractInterval({
  sourceIntervals,
  removeStart,
  removeEnd,
}: {
  sourceIntervals: Array<{ start: number; end: number }>;
  removeStart: number;
  removeEnd: number;
}): Array<{ start: number; end: number }> {
  return sourceIntervals.reduce<Array<{ start: number; end: number }>>(
    (remainingIntervals, currentInterval) => {
      if (
        removeStart >= currentInterval.end ||
        removeEnd <= currentInterval.start
      ) {
        remainingIntervals.push(currentInterval);
      } else {
        if (removeStart > currentInterval.start) {
          remainingIntervals.push({
            start: currentInterval.start,
            end: removeStart,
          });
        }
        if (removeEnd < currentInterval.end) {
          remainingIntervals.push({
            start: removeEnd,
            end: currentInterval.end,
          });
        }
      }
      return remainingIntervals;
    },
    [],
  );
}
