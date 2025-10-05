import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { Exclude } from 'class-transformer';
import { Profile } from './Profile';
import { Address } from './Address';

@Entity('users')
export class User extends Base {
  @Column({ name: 'profile_id', type: 'uuid', nullable: true })
  declare public profileId: string;

  @Column({ name: 'address_id', type: 'uuid', nullable: true })
  declare public addressId: string;

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
}
