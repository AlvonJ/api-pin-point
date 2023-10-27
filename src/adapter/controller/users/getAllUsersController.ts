import { Response, NextFunction } from 'express';

import { getAllUserInteractor } from '../../../domain/interactor/users/getAllUsersInteractor.js';
import { getAllUserPersistence } from '../../../infrastructure/database/mongodb/users/getAllUsersPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Read All Users
export async function getAllUsers(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const { limit = 10, page = 1 } = req.query;

    const users = await getAllUserInteractor(getAllUserPersistence, { limit, page });

    if (users.length === 0) return next(new AppError('No users found', 404));

    res.status(200).json({
      status: 'success',
      results: users.length,
      page: +page,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}
