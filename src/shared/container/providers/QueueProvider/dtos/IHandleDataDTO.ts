import type { IHandleDTO } from './IHandleDTO';

export type IHandleDataDTO<T extends IHandleDTO> = Parameters<
  InstanceType<T>['handle']
>[0]['data'];
