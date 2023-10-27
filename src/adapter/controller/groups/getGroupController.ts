import { Request, Response, NextFunction } from 'express';
import { getGroupInteractor } from '../../../domain/interactor/groups/getGroupInteractor.js';
import { getGroupPersistence } from '../../../infrastructure/database/mongodb/groups/getGroupPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Read One Group
export async function getGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const group = await getGroupInteractor(getGroupPersistence, id);

    if (!group) return next(new AppError('No groups found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: group,
    });
  } catch (err) {
    next(err);
  }
}
