import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum ActivityType {
  POST = 'POST',
  LIKE = 'LIKE',
  FOLLOW = 'FOLLOW',
  UNFOLLOW = 'UNFOLLOW',
}

@Entity('activity_log')
@Index('idx_user_activity', ['user', 'createdAt', 'activityType'])
export class ActivityLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' }) // Changed from enum to text
  activityType: ActivityType;

  @Column({ type: 'integer', nullable: true }) // Use integer for SQLite
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;
}
