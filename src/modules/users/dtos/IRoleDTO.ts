import type { Role } from '../entities/Role';

export interface IRoleDTO extends Partial<Role> {
  name: string;
}
