import { Request, Response, NextFunction } from 'express';

import { deleteGroupInteractor } from '../../../domain/interactor/groups/deleteGroupInteractor.js';
import { deleteGroupPersistence } from '../../../infrastructure/database/mongodb/groups/deleteGroupPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Delete Group
export async function deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await deleteGroupInteractor(deleteGroupPersistence, id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError('No users found with that ID', 404));

    next(err);
  }
}
