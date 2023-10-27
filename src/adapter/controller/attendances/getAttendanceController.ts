import { Request, Response, NextFunction } from 'express';
import { getAttendanceInteractor } from '../../../domain/interactor/attendances/getAttendanceInteractor.js';
import { getAttendancePersistence } from '../../../infrastructure/database/mongodb/attendances/getAttendancePersistence.js';
import { AppError } from '../../utils/AppError.js';

// Read One Attendance
export async function getAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const attendance = await getAttendanceInteractor(getAttendancePersistence, id);

    if (!attendance) return next(new AppError('No attendances found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
}
