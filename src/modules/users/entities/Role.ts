import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { RoleType } from '../enums/RoleType';
import { Permission } from './Permission';
import { User } from './User';

@Entity('roles')
export class Role extends Base {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  declare public name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  declare public description: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: RoleType,
    nullable: false,
    default: RoleType.CUSTOM,
  })
  declare public type: RoleType;

  @OneToMany(() => User, user => user.role, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare public users: Array<User>;

  @ManyToMany(() => Permission, permission => permission.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_roles_permissions_role',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_roles_permissions_permission',
    },
  })
  declare public permissions: Array<Permission>;
}
