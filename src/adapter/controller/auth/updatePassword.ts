import bcrypt from 'bcrypt';
import { Response, NextFunction } from 'express';
import { getUserInteractor } from '../../../domain/interactor/users/getUserInteractor.js';
import { getUserPersistence } from '../../../infrastructure/database/mongodb/users/getUserPersistence.js';
import { updateUserInteractor } from '../../../domain/interactor/users/updateUserInteractor.js';
import { updateUserPersistence } from '../../../infrastructure/database/mongodb/users/updateUserPersistence.js';
import { AppError } from '../../utils/AppError.js';
import { createSendToken } from './createSendToken.js';

export async function updatePassword(req, res: Response, next: NextFunction) {
  try {
    const id = req.user._id.toString();
    const { passwordCurrent, passwordNew } = req.body;

    const user = await getUserInteractor(getUserPersistence, id, false);

    // Check if user is exist and compare the password using bcrypt
    if (!user || !(await bcrypt.compare(passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong!', 401));
    }

    if (!passwordNew || passwordNew?.length < 6)
      return next(new AppError('Password length must be greater than 5', 400));

    const hashedPassword = await bcrypt.hash(passwordNew, 10);

    user.password = hashedPassword;

    const updatedUser = await updateUserInteractor(updateUserPersistence, { ...user, id });

    createSendToken(updatedUser, 200, req, res);
  } catch (err) {
    next(err);
  }
}
