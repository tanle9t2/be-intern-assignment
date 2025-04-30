import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from './User';

@Entity('follows')
@Index('idx_followed_id', ['followed']) // Index for fetching followers
export class UserFollow {
  @PrimaryColumn()
  follower_id: number;

  @PrimaryColumn()
  followed_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'followed_id' })
  followed: User;

  @CreateDateColumn()
  createdAt: Date;
}
