import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { IRoleTypeDTO } from '../dtos/IRoleTypeDTO';
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
    enum: IRoleTypeDTO,
    nullable: false,
    default: IRoleTypeDTO.CUSTOM,
  })
  declare public type: IRoleTypeDTO;

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
