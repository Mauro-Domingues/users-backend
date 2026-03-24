import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/users/entities/User';
import { Base } from '@shared/container/modules/entities/Base';
import { NotificationAction } from '../enums/NotificationAction';
import { NotificationType } from '../enums/NotificationType';

@Entity('notifications')
export class Notification extends Base {
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  declare public userId: string;

  @Column({ name: 'requester_id', type: 'uuid', nullable: true })
  declare public requesterId: string;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  declare public referenceId: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  declare public title: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  declare public content: string;

  @Column({ name: 'read', type: 'boolean', nullable: false, default: false })
  declare public read: boolean;

  @Column({
    name: 'type',
    type: 'enum',
    enum: NotificationType,
    nullable: false,
  })
  declare public type: NotificationType;

  @Column({
    name: 'action',
    type: 'enum',
    enum: NotificationAction,
    nullable: false,
  })
  declare public action: NotificationAction;

  @ManyToOne(() => User, user => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_notifications_user',
    referencedColumnName: 'id',
  })
  declare public user: User;

  @ManyToOne(() => User, user => user, {
    onDelete: 'CASCADE',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({
    name: 'requester_id',
    foreignKeyConstraintName: 'FK_notifications_requester',
    referencedColumnName: 'id',
  })
  declare public requester: User;
}
