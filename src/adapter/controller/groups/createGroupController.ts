import { Request, Response, NextFunction } from 'express';
import { createGroupInteractor } from '../../../domain/interactor/groups/createGroupInteractor.js';
import { createGroupPersistence } from '../../../infrastructure/database/mongodb/groups/createGroupPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Create Group
export async function createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, admin, member, tagLocation, invitations } = req.body;

    const newGroup = await createGroupInteractor(createGroupPersistence, {
      name,
      member,
      admin,
      tagLocation,
      invitations,
    });

    res.status(201).json({
      status: 'success',
      data: newGroup,
    });
  } catch (err) {
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
