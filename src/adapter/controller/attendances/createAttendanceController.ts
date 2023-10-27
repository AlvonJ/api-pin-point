import { Request, Response, NextFunction } from 'express';
import { createAttendanceInteractor } from '../../../domain/interactor/attendances/createAttendanceInteractor.js';
import { createAttendancePersistence } from '../../../infrastructure/database/mongodb/attendances/createAttendancePersistence.js';
import { AppError } from '../../utils/AppError.js';

// Create Attendance
export async function createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { photo, location, tagLocation, user, group } = req.body;

    const newAttendance = await createAttendanceInteractor(createAttendancePersistence, {
      photo,
      location,
      tagLocation,
      user,
      group,
    });

    res.status(201).json({
      status: 'success',
      data: newAttendance,
    });
  } catch (err) {
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
