import { Request, Response, NextFunction } from 'express';

import { deleteAttendanceInteractor } from '../../../domain/interactor/attendances/deleteAttendanceInteractor.js';
import { deleteAttendancePersistence } from '../../../infrastructure/database/mongodb/attendances/deleteAttendancePersistence.js';
import { AppError } from '../../utils/AppError.js';

// Delete Attendance
export async function deleteAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await deleteAttendanceInteractor(deleteAttendancePersistence, id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError('No users found with that ID', 404));

    next(err);
  }
}
