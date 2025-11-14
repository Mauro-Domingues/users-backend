import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { Address } from './Address';
import { Permission } from './Permission';
import { Profile } from './Profile';
import { Role } from './Role';

@Entity('users')
export class User extends Base {
  @Column({ name: 'profile_id', type: 'uuid', nullable: true })
  declare public profileId: string;

  @Column({ name: 'address_id', type: 'uuid', nullable: true })
  declare public addressId: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  declare public roleId: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  declare public email: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', nullable: false })
  declare public password: string;

  @OneToOne(() => Profile, profile => profile, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'profile_id',
    foreignKeyConstraintName: 'FK_users_profile',
    referencedColumnName: 'id',
  })
  declare public profile: Profile;

  @OneToOne(() => Address, address => address, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'address_id',
    foreignKeyConstraintName: 'FK_users_address',
    referencedColumnName: 'id',
  })
  declare public address: Address;

  @ManyToOne(() => Role, role => role.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'FK_users_role',
    referencedColumnName: 'id',
  })
  declare public role: Role;

  @ManyToMany(() => Permission, permission => permission.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'users_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_users_permissions_user',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_users_permissions_permission',
    },
  })
  declare public permissions: Array<Permission>;
}
