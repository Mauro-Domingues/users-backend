import type { IHandleDTO } from './IHandleDTO.js';

export type IQueueDTO<T> = Record<
  Capitalize<string>,
  InstanceType<IHandleDTO> & {
    queue: T;
  }
>;
