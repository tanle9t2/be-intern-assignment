import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';

import { UserFollow } from '../controllers/userFollow.controller';

export const followRouter = Router();
const followController = new UserFollow();

// Find followers of a user
followRouter.get(
  '/:followerId/:followeredId',
  followController.getUserFollowById.bind(followController)
);

// Find users a user is following
followRouter.get('/', followController.getAllUserFollow.bind(followController));

// Create a follow
followRouter.post('/', followController.createFollow.bind(followController));

// Update a follow
followRouter.put(
  '/:followerId/:followeredId',
  followController.updateFollow.bind(followController)
);

// Delete a follow
followRouter.delete(
  '/:followerId/:followeredId',
  followController.deleteFollow.bind(followController)
);
