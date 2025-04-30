import { EntitySubscriberInterface, EventSubscriber, In, RemoveEvent } from 'typeorm';
import { Post } from '../entities/Post';
import { ActivityLog, ActivityType } from '../entities/ActivityLog';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  listenTo() {
    return Post;
  }

  async afterRemove(event: RemoveEvent<Post>) {
    // Check if event.entity is defined

    if (event.entity) {
      // Proceed only if the entity exists

      const activityRepo = event.manager.getRepository(ActivityLog);
      await activityRepo.delete({
        targetId: event.entityId,
        activityType: In([ActivityType.POST, ActivityType.LIKE]),
      });
    } else {
      // Handle case where entity is undefined (e.g., cascade delete)
      console.warn('Post entity was not loaded before removal.');
    }
  }
}
