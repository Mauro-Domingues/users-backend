import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permission } from './Permission';
import { User } from './User';

@Entity('users_permissions')
export class UserPermission {
  @Index('INDEX_users_permissions_user_id', ['userId'])
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  declare public userId: string;

  @Index('INDEX_users_permissions_permission_id', ['permissionId'])
  @PrimaryColumn({
    name: 'permission_id',
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  declare public permissionId: string;

  @ManyToOne(() => User, user => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_user_permissions_user',
    referencedColumnName: 'id',
  })
  declare public user: User;

  @ManyToOne(() => Permission, permission => permission, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'permission_id',
    foreignKeyConstraintName: 'FK_user_permissions_permission',
    referencedColumnName: 'id',
  })
  declare public permission: Permission;
}
