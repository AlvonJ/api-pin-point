import { Response, NextFunction } from 'express';
import { updateGroupInteractor } from '../../../domain/interactor/groups/updateGroupInteractor.js';
import { updateGroupPersistence } from '../../../infrastructure/database/mongodb/groups/updateGroupPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Update Group
export async function updateGroup(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { name, member, admin, tagLocation, invitations } = req.body;
    const { user } = req;

    // Check if the user is not allowed to update member, name, or invitations of other members
    if (user.role === 'user') {
      if (member || name) {
        return next(new AppError("You don't have permission to update member or name", 401));
      }

      if (invitations.some(invitation => invitation.user !== user._id.toString())) {
        return next(new AppError("You don't have permission to update invitations of another member", 401));
      }
    }

    const updatedGroup = await updateGroupInteractor(updateGroupPersistence, {
      id,
      name,
      member,
      admin,
      tagLocation,
      invitations,
      isUpdating: true,
    });

    res.status(200).json({
      status: 'success',
      data: updatedGroup,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
