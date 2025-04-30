import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';

import { ActivityLogController } from '../controllers/activityLog.controller';

export const activityLogRouter = Router();
const activityLogController = new ActivityLogController();

// Get all activities
activityLogRouter.get('/', activityLogController.getAllActivities.bind(activityLogController));

// Get activity by id
activityLogRouter.get('/:id', activityLogController.getActivityById.bind(activityLogController));

// Get activities by user
activityLogRouter.get(
  '/user/:userId',
  activityLogController.getActivitiesByUser.bind(activityLogController)
);

// Create new activity
activityLogRouter.post(
  '/',

  activityLogController.createActivity.bind(activityLogController)
);

// Update activity
activityLogRouter.put(
  '/:id',
  activityLogController.updateActivity.bind(activityLogController)
);

// Delete activity
activityLogRouter.delete('/:id', activityLogController.deleteActivity.bind(activityLogController));
