import { Response, NextFunction } from 'express';
import { getAllAttendancesInteractor } from '../../../domain/interactor/attendances/getAllAttendancesInteractor.js';
import { getAllAttendancesPersistence } from '../../../infrastructure/database/mongodb/attendances/getAllAttendancesPersistence.js';
import { AppError } from '../../utils/AppError.js';

// Read Current User Attendance
export async function getCurrentUserAttendances(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user._id.toString();

    const { limit = 10, page = 1, startDate, endDate } = req.query;

    const attendance = await getAllAttendancesInteractor(getAllAttendancesPersistence, {
      limit,
      page,
      startDate,
      endDate,
      userId,
    });

    if (attendance.length === 0) return next(new AppError('No attendance found', 404));

    res.status(200).json({
      status: 'success',
      results: attendance.length,
      page: +page,
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
}
