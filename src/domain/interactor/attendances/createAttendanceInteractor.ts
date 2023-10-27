import { AttendanceEntity, AttendanceInterface } from '../../entity/AttendanceEntity.js';

export async function createAttendanceInteractor(
  createAttendancePersistence: (attendance: AttendanceInterface) => Promise<any>,
  attendance: AttendanceInterface
): Promise<AttendanceInterface> {
  const attendanceObject = new AttendanceEntity(attendance);

  attendanceObject.validate();

  const validatedAttendance = { ...attendance, date: attendanceObject.date };

  const newAttendance = await createAttendancePersistence(validatedAttendance);

  return newAttendance;
}
