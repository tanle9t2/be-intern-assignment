import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany } from 'typeorm';
import { Post } from './Post';
@Entity('hashtags')
@Index('idx_tag_name', ['tagName'], { unique: true }) // Unique index for tag_name
export class Hashtag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  tagName: string;

  @ManyToMany(() => Post, (post) => post.hashtags, { onDelete: 'CASCADE' })
  posts: Post[];
}
