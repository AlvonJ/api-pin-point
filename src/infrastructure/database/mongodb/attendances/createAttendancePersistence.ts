import { AttendanceInterface } from '../../../../domain/entity/AttendanceEntity.js';
import { client } from '../index.js';
import { getAttendancePersistence } from './getAttendancePersistence.js';

export async function createAttendancePersistence(attendance: AttendanceInterface) {
  try {
    await client.connect();

    const db = client.db('pin-point');
    const attendancesCollection = db.collection('attendances');

    const result = await attendancesCollection.insertOne(attendance);

    const insertedAttendance = await getAttendancePersistence(result.insertedId.toString());

    return insertedAttendance;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    await client.close();
  }
}
