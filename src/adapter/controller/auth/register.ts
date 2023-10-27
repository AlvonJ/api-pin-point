import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { createUserInteractor } from '../../../domain/interactor/users/createUserInteractor.js';
import { createUserPersistence } from '../../../infrastructure/database/mongodb/users/createUserPersistence.js';
import { AppError } from '../../utils/AppError.js';
import { createSendToken } from './createSendToken.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, email, phone, photo } = req.body;

    if (!password || password?.length < 6) return next(new AppError('Password length must be greater than 5', 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUserInteractor(createUserPersistence, {
      password: hashedPassword,
      username,
      email,
      phone,
      photo,
    });

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
