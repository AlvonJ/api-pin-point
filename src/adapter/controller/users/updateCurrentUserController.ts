import { Request, Response, NextFunction } from 'express';
import { updateUserInteractor } from '../../../domain/interactor/users/updateUserInteractor.js';
import { updateUserPersistence } from '../../../infrastructure/database/mongodb/users/updateUserPersistence.js';

// Update Current User
export async function updateCurrentUser(req: any, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.user._id;

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
    next(err);
  }
}
