import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { User } from './User';

@Entity('tokens')
@Unique('UNIQUE_tokens_user_id_device_id', ['userId', 'deviceId'])
export class Token extends Base {
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  declare public userId: string;

  @Column({ name: 'device_id', type: 'varchar', nullable: false })
  declare public deviceId: string;

  @Column({ name: 'token', type: 'varchar', nullable: false })
  declare public token: string;

  @OneToOne(() => User, user => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_tokens_user',
    referencedColumnName: 'id',
  })
  declare public user: User;
}
