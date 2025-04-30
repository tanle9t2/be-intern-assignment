import Joi from 'joi';

export const createPostSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required',
  }),

  content: Joi.string().min(1).max(1000).required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content cannot be empty',
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 1000 characters',
    'any.required': 'Content is required',
  }),

  createdAt: Joi.date().optional().messages({
    'date.base': 'Created At must be a valid date',
  }),
});

export const deletePostSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'Post ID must be a number',
    'number.integer': 'Post ID must be an integer',
    'number.positive': 'Post ID must be a positive number',
    'any.required': 'Post ID is required',
  }),
});
