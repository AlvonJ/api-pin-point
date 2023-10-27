import { Response, NextFunction } from 'express';

import { getGroupsByInvitationUserIdInteractor } from '../../../domain/interactor/groups/getGroupsByInvitationUserIdInteractor.js';
import { getGroupsByInvitationUserIdPersistence } from '../../../infrastructure/database/mongodb/groups/getGroupsByInvitationUserIdPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Read All Groups
export async function getGroupsByInvitationUserId(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user._id.toString();

    const groups = await getGroupsByInvitationUserIdInteractor(getGroupsByInvitationUserIdPersistence, userId);

    if (groups.length === 0) return next(new AppError('No groups found', 404));

    res.status(200).json({
      status: 'success',
      results: groups.length,
      data: groups,
    });
  } catch (err) {
    next(err);
  }
}
