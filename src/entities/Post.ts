import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Hashtag } from './Hashtag';
import { Like } from './Like';

@Entity('posts')
@Index('idx_user_created', ['user', 'createdAt']) // Index for user timeline queries
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  // In Post entity
  @OneToMany(() => Like, (like) => like.post, { onDelete: 'CASCADE' })
  likes: Like[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'post_hashtags', // Specify custom join table name
    joinColumn: {
      name: 'post_id', // Name of the foreign key column in the join table pointing to the Post
      referencedColumnName: 'id', // Reference the id of the Post entity
    },
    inverseJoinColumn: {
      name: 'hashtag_id', // Name of the foreign key column in the join table pointing to the Hashtag
      referencedColumnName: 'id', // Reference the id of the Hashtag entity
    },
  })
  hashtags: Hashtag[];
}
