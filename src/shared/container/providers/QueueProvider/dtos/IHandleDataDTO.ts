import type { IHandleDTO } from './IHandleDTO.js';

export type IHandleDataDTO<T extends IHandleDTO> =
  InstanceType<T> extends { handle(args: { data: infer Data }): unknown }
    ? Data
    : never;
