import { AttendanceEntity } from '../../entity/AttendanceEntity.js';

interface QueryParamsInterface {
  limit: number;
  page: number;
  startDate: Date;
  endDate: Date;
  userId: string;
}

export async function getAllAttendancesInteractor(
  getAllAttendancesPersistence: (
    limit: number,
    page: number,
    startDate: Date,
    endDate: Date,
    userId: string
  ) => Promise<Array<any>>,
  queryParams: QueryParamsInterface
): Promise<Array<AttendanceEntity>> {
  const { limit, page, startDate, endDate, userId } = queryParams;

  const attendances = await getAllAttendancesPersistence(limit, page, startDate, endDate, userId);

  return attendances;
}
