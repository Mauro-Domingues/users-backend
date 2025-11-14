import type { Permission } from '../entities/Permission';
import type { IPermissionMethodDTO } from './IPermissionMethodDTO';

export interface IPermissionDTO extends Partial<Permission> {
  route: string;
  method: IPermissionMethodDTO;
  name: string;
}
