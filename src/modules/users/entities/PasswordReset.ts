import { Base } from '@shared/container/modules/entities/Base';
import { Entity, Column, JoinColumn, ManyToOne, Unique, Index } from 'typeorm';
import { User } from './User';

@Entity('password_resets')
@Unique('UNIQUE_password_resets_user_id_recovery_code', [
  'userId',
  'recoveryCode',
])
export class PasswordReset extends Base {
  @Index('INDEX_password_resets_user_id', ['userId'])
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  declare public userId: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  declare public email: string;

  @Column({ name: 'recovery_code', type: 'int', width: 6, nullable: false })
  declare public recoveryCode: number;

  @ManyToOne(() => User, user => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_password_resets_user',
    referencedColumnName: 'id',
  })
  declare public user: User;
}
