import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';

import { PostController } from '../controllers/post.controller';
import { validateUser } from '../middleware/fakeAuthentication.middleware';
import { createPostSchema, deletePostSchema } from '../validations/post.validation';

export const postRouter = Router();
const postController = new PostController();

// Get all posts
postRouter.get('/', postController.getAllPosts.bind(postController));

// Get post by ID
postRouter.get('/:id', postController.getPostById.bind(postController));

// Create new post
postRouter.post('/', validate(createPostSchema), postController.createPost.bind(postController));

// Update post
postRouter.put('/:id', postController.updatePost.bind(postController));
postRouter.get('/hashtag/:tag', postController.getPostByTag.bind(postController));

// Delete post
postRouter.delete(
  '/:id',
  validate(deletePostSchema),
  postController.deletePost.bind(postController)
);
