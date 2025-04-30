import Joi from 'joi';

export const createHashtagSchema = Joi.object({
  tagName: Joi.string().required().min(2).max(50).messages({
    'string.empty': 'Tag name is required',
    'string.min': 'Tag name must be at least 2 characters long',
    'string.max': 'Tag name cannot exceed 50 characters',
  }),
});

export const updateHashtagSchema = Joi.object({
  tagName: Joi.string().min(2).max(50).messages({
    'string.min': 'Tag name must be at least 2 characters long',
    'string.max': 'Tag name cannot exceed 50 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
