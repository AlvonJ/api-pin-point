import { Request, Response, NextFunction } from 'express';
import { updateUserInteractor } from '../../../domain/interactor/users/updateUserInteractor.js';
import { updateUserPersistence } from '../../../infrastructure/database/mongodb/users/updateUserPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Update User
export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { username, email, password, phone, photo } = req.body;

    const updatedUser = await updateUserInteractor(updateUserPersistence, {
      id,
      username,
      email,
      password,
      phone,
      photo,
      isUpdating: true,
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError') return next(new AppError(err.message, 400));

    next(err);
  }
}
