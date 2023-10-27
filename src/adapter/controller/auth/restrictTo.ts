import { AppError } from '../../utils/AppError.js';
import { Response, NextFunction } from 'express';

export function restrictTo(...roles: Array<String>) {
  return (req, res: Response, next: NextFunction) => {
    // roles: ['admin']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}
