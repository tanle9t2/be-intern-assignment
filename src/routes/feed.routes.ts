import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { validateUser } from '../middleware/fakeAuthentication.middleware';

export const feedRouter = Router();
const postController = new PostController();

feedRouter.get('/', validateUser, postController.getFeed.bind(postController));
