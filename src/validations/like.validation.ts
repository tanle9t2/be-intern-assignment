import Joi from 'joi';

export const createLikeSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required',
  }),

  post_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Post ID must be a number',
    'number.integer': 'Post ID must be an integer',
    'number.positive': 'Post ID must be a positive number',
    'any.required': 'Post ID is required',
  }),

  createdAt: Joi.date()
    .optional() // Optional as TypeORM handles this automatically
    .messages({
      'date.base': 'Created At must be a valid date',
    }),
});
