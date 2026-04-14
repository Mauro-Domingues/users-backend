export type IWeeklyScheduleDTO = Record<
  '0' | '1' | '2' | '3' | '4' | '5' | '6',
  Array<{
    start: string;
    end: string;
  }> | null
>;
