import { EntitySubscriberInterface, EventSubscriber, In, RemoveEvent } from 'typeorm';

import { ActivityLog, ActivityType } from '../entities/ActivityLog';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

@EventSubscriber()
export class UserSubcriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterRemove(event: RemoveEvent<User>) {
    // Check if event.entity is defined
    if (event.entity) {
      const activityRepo = event.manager.getRepository(ActivityLog);
      const postIds = event.entity.posts?.map((post) => post.id) || [];

      const deleteOperations = [
        activityRepo.delete({
          user: { id: event.entityId },
        }),
      ];

      if (postIds.length > 0) {
        deleteOperations.push(
          activityRepo.delete({
            targetId: In(postIds),
            activityType: ActivityType.LIKE,
          })
        );
      }

      await Promise.all(deleteOperations);

      // Optional: Log results
      console.log(`Deleted activity logs for user ${event.entityId}`);
      if (postIds.length) {
        console.log(`Also deleted LIKE logs for post IDs: ${postIds.join(', ')}`);
      }
    } else {
      console.warn('User entity not loaded before removal. No activities deleted.');
    }
  }
}
