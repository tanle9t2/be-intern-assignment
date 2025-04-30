import { ILike, In, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { UserFollow } from '../entities/UserFollow';
import { Pagination } from '../interface/response.interface';
import { ActivityLogService } from './activityLog.service';
import { ActivityType } from '../entities/ActivityLog';
import { Hashtag } from '../entities/Hashtag';

export class PostService {
  private postRepository: Repository<Post> = AppDataSource.getRepository(Post);
  private followRepository = AppDataSource.getRepository(UserFollow);
  private userRepository: Repository<User> = AppDataSource.getRepository(User);
  private hashtagRepository: Repository<Hashtag> = AppDataSource.getRepository(Hashtag);

  private activityLogService = new ActivityLogService();

  async findPostsByHashtag(
    hashtagName: string,
    offset: number = 1,
    limit: number = 10
  ): Promise<{ data: Post[]; pagination: Pagination }> {
    if (!hashtagName) throw new Error('Hashtag name is required');
    offset = Math.max(1, offset); // Ensure the page is at least 1
    limit = Math.max(1, limit); // Ensure the limit is at least 1
    const skip = (offset - 1) * limit; // Skip results based on the page
    const take = limit; // Number of results to take (limit)

    const [posts, totalPosts] = await this.postRepository.findAndCount({
      where: {
        hashtags: { tagName: ILike(hashtagName) },
      },
      relations: ['user'],
      order: {
        createdAt: 'DESC', // Newest first
      },
      skip,
      take,
    });
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      data: posts,
      pagination: {
        total: totalPosts,
        page: offset,
        size: limit,
        totalPages,
      },
    };
  }

  async findFeed(
    userId: number,
    offset: number = 1,
    limit: number = 10
  ): Promise<{ data: Post[]; pagination: Pagination }> {
    if (!userId) throw new Error('User ID and content are required');
    const followedUsers = await this.followRepository.find({
      where: { follower_id: userId },
    });

    //Find the users that the current user follows
    const followedIds = followedUsers.map((follow) => follow.followed_id);
    offset = Math.max(1, offset); // Ensure the page is at least 1
    limit = Math.max(1, limit); // Ensure the limit is at least 1

    const skip = (offset - 1) * limit; // Skip results based on the page
    const take = limit; // Number of results to take (limit)

    const [posts, totalPosts] = await this.postRepository.findAndCount({
      where: {
        user: { id: In(followedIds) },
      },
      relations: ['user', 'hashtags'],
      order: {
        createdAt: 'DESC', // Newest first
      },
      skip,
      take,
    });
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      data: posts,
      pagination: {
        total: totalPosts,
        page: offset,
        size: limit,
        totalPages,
      },
    };
  }

  // Create
  async createPost(userId: number, content: string): Promise<Post> {
    if (!userId || !content) throw new Error('User ID and content are required');

    // Find or create hashtags
    const tagNames = [...content.matchAll(/#([a-zA-Z0-9_]+)/g)].map((match) => match[1]);
    const hashtags = [];

    for (const tag of tagNames) {
      const normalizedTag = tag.toLowerCase(); // Normalize the tag to lowercase

      let hashtag = await this.hashtagRepository
        .createQueryBuilder('hashtag')
        .where('LOWER(hashtag.tagName) = :tag', { tag: normalizedTag })
        .getOne();

      if (!hashtag) {
        hashtag = this.hashtagRepository.create({ tagName: normalizedTag });
        await this.hashtagRepository.save(hashtag); // Save new hashtag
      }

      hashtags.push(hashtag); // Collect all hashtags
    }

    // Create the post
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const post = this.postRepository.create({
      user,
      content,
      hashtags, // Add hashtags to the post
    });

    // Save the post and return
    const savedPost = await this.postRepository.save(post);
    this.activityLogService.createActivityLog(userId, ActivityType.POST, savedPost.id);

    return savedPost;
  }

  // Read
  async findAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user', 'hashtags'] });
  }

  async findPostById(id: number): Promise<Post | null> {
    if (!id) throw new Error('Post ID is required');
    return this.postRepository.findOne({
      where: { id },
      relations: ['user', 'hashtags'],
    });
  }

  // Update
  async updatePost(id: number, updates: Partial<Post>): Promise<Post | null> {
    if (!id) throw new Error('Post ID is required');
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new Error('Post not found');
    await this.postRepository.update(id, updates);
    return this.postRepository.findOneBy({ id });
  }

  // Delete
  async deletePost(id: number): Promise<void> {
    if (!id) throw new Error('Post ID is required');
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new Error('Post not found');
    await this.postRepository.remove(post);
  }
}
