import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { User } from './User';

@Entity('tokens')
export class Token extends Base {
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  declare public userId: string;

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
