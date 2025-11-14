import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { File } from '@modules/system/entities/File';
import { Base } from '@shared/container/modules/entities/Base';

@Entity('profiles')
export class Profile extends Base {
  @Column({ name: 'avatar_id', type: 'uuid', nullable: true })
  declare public avatarId: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  declare public fullName: string;

  @Column({ name: 'cpf', type: 'varchar', length: 11, nullable: true })
  declare public cpf: string;

  @Column({ name: 'birthday', type: 'date', nullable: true })
  declare public birthday: Date;

  @Column({ name: 'phone', type: 'varchar', length: 11, nullable: true })
  declare public phone: string;

  @OneToOne(() => File, avatar => avatar, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'avatar_id',
    foreignKeyConstraintName: 'FK_profiles_avatar',
    referencedColumnName: 'id',
  })
  declare public avatar: File;
}
