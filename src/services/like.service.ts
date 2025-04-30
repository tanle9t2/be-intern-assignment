import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Like } from '../entities/Like';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { ActivityLogService } from './activityLog.service';
import { ActivityType } from '../entities/ActivityLog';

export class LikeService {
  private likeRepository: Repository<Like> = AppDataSource.getRepository(Like);
  private userRepository: Repository<User> = AppDataSource.getRepository(User);
  private postRepository: Repository<Post> = AppDataSource.getRepository(Post);

  private activityLogService = new ActivityLogService();

  // Create
  async createLike(userId: number, postId: number): Promise<Like> {
    if (!userId || !postId) throw new Error('User ID and Post ID are required');
    const user = await this.userRepository.findOneBy({ id: userId });
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!user || !post) throw new Error('User or Post not found');
    const existingLike = await this.likeRepository.findOneBy({ user_id: userId, post_id: postId });
    if (existingLike) throw new Error('Like already exists');
    const like = this.likeRepository.create({ user, post });
    await this.postRepository.increment({ id: postId }, 'likeCount', 1);
    const newLike = this.likeRepository.save(like);
    this.activityLogService.createActivityLog(userId, ActivityType.LIKE, postId);
    return newLike;
  }

  // Read
  async findAllLikes(): Promise<Like[]> {
    return this.likeRepository.find();
  }

  async findLikesById(userId: number, postId: number): Promise<Like | null> {
    if (!userId) throw new Error('User ID is required');
    return this.likeRepository.findOne({
      where: { user_id: userId, post_id: postId },
      relations: ['user', 'post'],
    });
  }

  // Update (not typically used for likes, but included for completeness)
  async updateLike(userId: number, postId: number, updates: Partial<Like>): Promise<Like | null> {
    if (!userId || !postId) throw new Error('User ID and Post ID are required');
    const like = await this.likeRepository.findOneBy({ user_id: userId, post_id: postId });
    if (!like) throw new Error('Like not found');
    console.log(userId, postId, updates);
    await this.likeRepository.update({ user_id: userId, post_id: postId }, updates);
    return this.likeRepository.findOneBy({ user_id: userId, post_id: postId });
  }

  // Delete
  async deleteLike(userId: number, postId: number): Promise<void> {
    if (!userId || !postId) throw new Error('User ID and Post ID are required');
    const like = await this.likeRepository.findOneBy({ user_id: userId, post_id: postId });
    if (!like) throw new Error('Like not found');
    await this.postRepository.decrement({ id: postId }, 'likeCount', 1);
    await this.likeRepository.delete({ user_id: userId, post_id: postId });
  }
}
