import { AttendanceEntity } from '../../entity/AttendanceEntity.js';

export async function getAttendanceInteractor(
  getAttendancePersistence: (id: string) => Promise<any>,
  id: string
): Promise<AttendanceEntity> {
  const attendance = await getAttendancePersistence(id);

  return attendance;
}
