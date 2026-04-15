export function unionIntervals(
  sourceIntervals: Array<{ start: number; end: number }> = [],
): Array<{ start: number; end: number }> {
  if (sourceIntervals.length === 0) return [];
  const sortedIntervals = [...sourceIntervals].sort(
    (a, b) => a.start - b.start,
  );

  return sortedIntervals.reduce<Array<{ start: number; end: number }>>(
    (mergedIntervals, currentInterval) => {
      const lastMerged = mergedIntervals.at(-1);
      if (!lastMerged) {
        mergedIntervals.push({ ...currentInterval });
      } else if (currentInterval.start <= lastMerged.end) {
        lastMerged.end = Math.max(lastMerged.end, currentInterval.end);
      } else {
        mergedIntervals.push({ ...currentInterval });
      }
      return mergedIntervals;
    },
    [],
  );
}
