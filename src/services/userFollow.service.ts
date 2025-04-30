import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UserFollow } from '../entities/UserFollow';
import { User } from '../entities/User';
import { Pagination } from '../interface/response.interface';
import { ActivityLogService } from './activityLog.service';
import { ActivityType } from '../entities/ActivityLog';

export class UserFollowService {
  private followRepository: Repository<UserFollow> = AppDataSource.getRepository(UserFollow);
  private userRepository: Repository<User> = AppDataSource.getRepository(User);

  private activityLogService = new ActivityLogService();
  // Create
  async createFollow(followerId: number, followedId: number): Promise<UserFollow> {
    if (!followerId || !followedId) throw new Error('Follower ID and Followed ID are required');
    if (followerId === followedId) throw new Error('Cannot follow self');
    const follower = await this.userRepository.findOneBy({ id: followerId });
    const followed = await this.userRepository.findOneBy({ id: followedId });
    if (!follower || !followed) throw new Error('User not found');
    const existingFollow = await this.followRepository.findOneBy({
      follower_id: followerId,
      followed_id: followedId,
    });
    if (existingFollow) throw new Error('Already following');
    const follow = this.followRepository.create({ follower, followed });

    const newFollower = this.followRepository.save(follow);
    this.activityLogService.createActivityLog(followerId, ActivityType.FOLLOW, followedId);
    return newFollower;
  }

  // Read
  async findFollowersWithPagination(
    userId: number,
    offset: number = 1,
    limit: number = 10
  ): Promise<{ data: UserFollow[]; pagination: Pagination }> {
    if (!userId) throw new Error('User ID is required');

    // Ensure valid page and limit values
    offset = Math.max(1, offset); // Ensure the page is at least 1
    limit = Math.max(1, limit); // Ensure the limit is at least 1

    const skip = (offset - 1) * limit; // Skip results based on the page
    const take = limit; // Number of results to take (limit)

    // Fetch followers with pagination
    const [followers, totalFollowers] = await this.followRepository.findAndCount({
      where: { followed_id: userId },
      relations: ['follower'],
      skip, // Skip results based on the current page
      take, // Limit the number of results
      order: {
        createdAt: 'DESC', // Sort by createdAt descending (newest first)
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalFollowers / limit);

    // Return the followers data along with pagination metadata
    return {
      data: followers,
      pagination: {
        total: totalFollowers,
        page: offset,
        size: limit,
        totalPages,
      },
    };
  }

  async findUserFollowById(followerId: number, followedId: number): Promise<UserFollow | null> {
    if (!followerId || !followedId) throw new Error('followerId and followedId are required');
    return this.followRepository.findOne({
      where: { follower_id: followerId, followed_id: followedId },
      relations: ['follower', 'followed'],
    });
  }

  async findAllUserFollow(): Promise<UserFollow[]> {
    return this.followRepository.find({
      relations: ['follower', 'followed'],
    });
  }

  // Update (not typically used for follows, but included)
  async updateFollow(
    followerId: number,
    followedId: number,
    updates: Partial<UserFollow>
  ): Promise<UserFollow | null> {
    if (!followerId || !followedId) throw new Error('Follower ID and Followed ID are required');
    const follow = await this.followRepository.findOneBy({
      follower_id: followerId,
      followed_id: followedId,
    });
    if (!follow) throw new Error('Follow not found');
    await this.followRepository.update(
      { follower_id: followerId, followed_id: followedId },
      updates
    );
    return this.followRepository.findOneBy({ follower_id: followerId, followed_id: followedId });
  }

  // Delete
  async deleteFollow(followerId: number, followedId: number): Promise<void> {
    console.log(followedId, followedId);
    if (!followerId || !followedId) throw new Error('Follower ID and Followed ID are required');
    const follow = await this.followRepository.findOneBy({
      follower_id: followerId,
      followed_id: followedId,
    });

    if (!follow) throw new Error('Follow not found');
    await this.followRepository.delete({ follower_id: followerId, followed_id: followedId });
    this.activityLogService.createActivityLog(followerId, ActivityType.UNFOLLOW, followedId);
  }
}
