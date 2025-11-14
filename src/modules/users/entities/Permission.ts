import { Column, Entity, ManyToMany, Unique } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { IPermissionMethodDTO } from '../dtos/IPermissionMethodDTO';
import { Role } from './Role';
import { User } from './User';

@Entity('permissions')
export class Permission extends Base {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  declare public name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  declare public description: string;

  @Column({ name: 'route', type: 'varchar', nullable: false })
  declare public route: string;

  @Unique('UNIQUE_permissions_slug', ['slug'])
  @Column({ name: 'slug', type: 'varchar', nullable: false })
  declare public slug: string;

  @Column({
    name: 'method',
    type: 'enum',
    enum: IPermissionMethodDTO,
    nullable: false,
  })
  declare public method: IPermissionMethodDTO;

  @ManyToMany(() => Role, role => role.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare public roles: Array<Role>;

  @ManyToMany(() => User, user => user.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare public users: Array<User>;
}
