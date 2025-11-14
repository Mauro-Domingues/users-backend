import type { IIntervalDTO } from '@dtos/IIntervalDTO';
import type { IHandleDataDTO } from '../dtos/IHandleDataDTO';
import type { IHandleDTO } from '../dtos/IHandleDTO';

export interface IQueueProvider {
  execute<T extends IHandleDTO>(data: {
    job: T;
    data: IHandleDataDTO<T>;
    attempts?: number;
  }): Promise<unknown>;
  schedule<T extends IHandleDTO>(data: {
    job: T;
    data: IHandleDataDTO<T>;
    delay: IIntervalDTO;
    attempts?: number;
  }): Promise<unknown>;
}
