import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { LikeController } from '../controllers/like.controller';

export const likeRouter = Router();
const likeController = new LikeController();

// get likes by post
likeRouter.get('/:userId/:postId', likeController.getLikesByCompositeId.bind(likeController));
likeRouter.get('/', likeController.getAllLikes.bind(likeController));
// get likes by user

// Create new like
likeRouter.post('/', likeController.createLike.bind(likeController));

// Update like
likeRouter.put('/:userId/:postId', likeController.updateLike.bind(likeController));

// Delete like
likeRouter.delete('/:userId/:postId', likeController.deleteLike.bind(likeController));
