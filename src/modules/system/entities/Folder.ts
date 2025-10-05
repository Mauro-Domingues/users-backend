import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { File } from './File';

@Entity('folders')
export class Folder extends Base {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  declare public name: string;

  @Unique('UNIQUE_folders_slug', ['slug'])
  @Column({ name: 'slug', type: 'varchar', nullable: false })
  declare public slug: string;

  @OneToMany(() => File, file => file.folder, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare public files: Array<File>;
}
