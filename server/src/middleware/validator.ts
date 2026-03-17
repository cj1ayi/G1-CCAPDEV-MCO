import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  // Return the first error message to the frontend
  return res.status(400).json({ 
    message: errors.array()[0].msg,
    errors: errors.array() 
  });
};

// Rules

export const postValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 300 }).withMessage('Title must be between 5 and 300 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ max: 40000 }).withMessage('Content must be at most 40,000 characters'),
  body('space')
    .notEmpty().withMessage('Space name is required'),
  body('imageUrl')
    .optional({ values: 'falsy' })
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Image URL must be a valid http or https URL'),
];

export const postUpdateValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 300 }).withMessage('Title must be between 5 and 300 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ max: 40000 }).withMessage('Content must be at most 40,000 characters'),
  body('imageUrl')
    .optional({ values: 'falsy' })
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Image URL must be a valid http or https URL'),
]

export const commentValidationRules = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 10000 }).withMessage('Comment must be at most 10,000 characters'),
  body('postId')
    .isMongoId().withMessage('Invalid Post ID')
];

export const spaceValidationRules = [
  body('name')
    .notEmpty().withMessage('Space slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Name can only contain lowercase letters, numbers, and hyphens'),
  body('displayName')
    .notEmpty().withMessage('Display name is required')
    .isLength({ max: 50 }).withMessage('Display name must be at most 50 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
];
