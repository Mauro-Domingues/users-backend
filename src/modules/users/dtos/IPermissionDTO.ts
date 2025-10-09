import { Permission } from '../entities/Permission';
import { IPermissionMethodDTO } from './IPermissionMethodDTO';

export interface IPermissionDTO extends Partial<Permission> {
  route: string;
  method: IPermissionMethodDTO;
  name: string;
}
