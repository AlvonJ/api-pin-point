import { Request, Response, NextFunction } from 'express';

import { deleteUserInteractor } from '../../../domain/interactor/users/deleteUserInteractor.js';
import { deleteUserPersistence } from '../../../infrastructure/database/mongodb/users/deleteUserPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Delete User
export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await deleteUserInteractor(deleteUserPersistence, id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError('No users found with that ID', 404));

    next(err);
  }
}
