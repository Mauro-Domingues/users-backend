export type IScheduleDTO = Record<
  '0' | '1' | '2' | '3' | '4' | '5' | '6',
  {
    workHours: {
      start: string;
      end: string;
    };
    breaks: Array<{
      start: string;
      end: string;
    }>;
  } | null
>;
