import { Response, NextFunction } from 'express';

import { getAllGroupsInteractor } from '../../../domain/interactor/groups/getAllGroupsInteractor.js';
import { getAllGroupsPersistence } from '../../../infrastructure/database/mongodb/groups/getAllGroupsPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Read All Groups
export async function getAllGroups(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const { limit = 10, page = 1 } = req.query;

    const groups = await getAllGroupsInteractor(getAllGroupsPersistence, { limit, page });

    if (groups.length === 0) return next(new AppError('No groups found', 404));

    res.status(200).json({
      status: 'success',
      results: groups.length,
      page: +page,
      data: groups,
    });
  } catch (err) {
    next(err);
  }
}
