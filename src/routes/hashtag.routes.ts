// src/routes/hashtag.router.ts
import express from 'express';
import { HashtagController } from '../controllers/hashtag.controller'; // Adjust the path if needed
import { validate } from '../middleware/validation.middleware';
import { createHashtagSchema, updateHashtagSchema } from '../validations/hashtag.validation';

const hashtagRouter = express.Router();
const hashtagController = new HashtagController();

// Define the routes
hashtagRouter.get('/', hashtagController.getAllHashtags.bind(hashtagController));
hashtagRouter.get('/:id', hashtagController.getHashtagById.bind(hashtagController));
hashtagRouter.post(
  '/',
  validate(createHashtagSchema),
  hashtagController.createHashtag.bind(hashtagController)
);
hashtagRouter.put(
  '/:id',
  validate(updateHashtagSchema),
  hashtagController.updateHashtag.bind(hashtagController)
);
hashtagRouter.delete('/:id', hashtagController.deleteHashtag.bind(hashtagController));

export { hashtagRouter };
