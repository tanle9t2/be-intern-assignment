import { Between, In, Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { ActivityLog, ActivityType } from '../entities/ActivityLog';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { ActivityLogResponse, Pagination } from '../interface/response.interface';

export class ActivityLogService {
  private activityLogRepository: Repository<ActivityLog> = AppDataSource.getRepository(ActivityLog);
  private postRepository: Repository<Post> = AppDataSource.getRepository(Post);
  private userRepository: Repository<User> = AppDataSource.getRepository(User);

  // Create
  async createActivityLog(
    userId: number,
    activityType: ActivityType,
    targetId?: number
  ): Promise<ActivityLog> {
    if (!userId || !activityType) throw new Error('User ID and Activity Type are required');
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!Object.values(ActivityType).includes(activityType)) {
      throw new Error('Invalid activity type');
    }
    const activityLog = this.activityLogRepository.create({ user, activityType, targetId });
    return this.activityLogRepository.save(activityLog);
  }

  // Read
  async findAllActivities(): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({ relations: ['user'] });
  }

  async findActivityById(id: number): Promise<ActivityLog | null> {
    if (!id) throw new Error('Activity ID is required');
    return this.activityLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findActivitiesByUser(
    userId: number,
    activityType?: ActivityType,
    startDate?: Date,
    endDate?: Date,
    offset = 0,
    limit = 10
  ): Promise<{ data: ActivityLogResponse[]; pagination: Pagination }> {
    if (!userId) throw new Error('User ID is required');

    const where: any = { user: { id: userId } };
    if (activityType) {
      where.activityType = activityType;
    }
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    offset = Math.max(1, offset); // Ensure the page is at least 1
    limit = Math.max(1, limit); // Ensure the limit is at least 1
    const skip = (offset - 1) * limit; // Skip results based on the page
    const take = limit; // Number of results to take (limit)

    const [activities, total] = await this.activityLogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    const likePostIds: number[] = [];
    const followUserIds: number[] = [];

    activities.forEach((activity) => {
      if (
        (activity.activityType === ActivityType.LIKE ||
          activity.activityType === ActivityType.POST) &&
        activity.targetId
      ) {
        likePostIds.push(activity.targetId);
      }
      if (activity.activityType === ActivityType.FOLLOW && activity.targetId) {
        followUserIds.push(activity.targetId);
      }
    });
    console.log(likePostIds, followUserIds);
    const [posts, users] = await Promise.all([
      likePostIds.length
        ? this.postRepository.find({
            where: { id: In(likePostIds) },
          })
        : Promise.resolve([]),
      followUserIds.length
        ? this.userRepository.find({
            where: { id: In(followUserIds) },
          })
        : Promise.resolve([]),
    ]);

    const postMap = new Map(posts.map((post) => [post.id, post]));
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Enrich activities with full user and target (Post or User) object
    const enrichedActivities = activities.map((activity) => {
      let target = null;

      if (
        (activity.activityType === ActivityType.LIKE ||
          activity.activityType === ActivityType.POST) &&
        activity.targetId
      ) {
        target = postMap.get(activity.targetId) || null;
      }

      if (activity.activityType === ActivityType.FOLLOW && activity.targetId) {
        target = userMap.get(activity.targetId) || null;
      }

      return {
        id: activity.id,
        activityType: activity.activityType,
        target: target, // Full target object (Post or User) or null
        createdAt: activity.createdAt,
      };
    });

    const totalPages = Math.ceil(total / limit);
    const page = Math.floor(offset / limit) + 1;

    return {
      data: enrichedActivities,
      pagination: {
        total,
        page,
        size: limit,
        totalPages,
      },
    };
  }

  // Update
  async updateActivity(id: number, updates: Partial<ActivityLog>): Promise<ActivityLog | null> {
    if (!id) throw new Error('Activity ID is required');
    const activity = await this.activityLogRepository.findOneBy({ id });
    if (!activity) throw new Error('Activity not found');
    if (updates.activityType && !Object.values(ActivityType).includes(updates.activityType)) {
      throw new Error('Invalid activity type');
    }
    await this.activityLogRepository.update(id, updates);
    return this.activityLogRepository.findOneBy({ id });
  }

  // Delete
  async deleteActivity(id: number): Promise<void> {
    if (!id) throw new Error('Activity ID is required');
    const activity = await this.activityLogRepository.findOneBy({ id });
    if (!activity) throw new Error('Activity not found');
    await this.activityLogRepository.delete(id);
  }
}
