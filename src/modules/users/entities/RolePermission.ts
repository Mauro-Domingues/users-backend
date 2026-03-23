import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permission } from './Permission';
import { Role } from './Role';

@Entity('roles_permissions')
export class RolePermission {
  @Index('INDEX_roles_permissions_role_id', ['roleId'])
  @PrimaryColumn({
    name: 'role_id',
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  declare public roleId: string;

  @Index('INDEX_roles_permissions_permission_id', ['permissionId'])
  @PrimaryColumn({
    name: 'permission_id',
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  declare public permissionId: string;

  @ManyToOne(() => Role, role => role, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'FK_role_permissions_role',
    referencedColumnName: 'id',
  })
  declare public role: Role;

  @ManyToOne(() => Permission, permission => permission, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'permission_id',
    foreignKeyConstraintName: 'FK_role_permissions_permission',
    referencedColumnName: 'id',
  })
  declare public permission: Permission;
}
