import type { Permission } from '../entities/Permission';
import { PermissionMethod } from '../enums/PermissionMethod';

export interface IPermissionDTO extends Partial<Permission> {
  route: string;
  method: PermissionMethod;
  name: string;
}
