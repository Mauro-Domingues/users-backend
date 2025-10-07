import { Entity, Column } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';

@Entity('roles')
export class Role extends Base {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  declare public name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  declare public description: string;
}
