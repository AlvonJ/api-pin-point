import { AttendanceInterface } from '../../../../../domain/entity/AttendanceEntity.js';
import { faker } from '@faker-js/faker';
import { client } from '../../index.js';
import { getAllAttendancesPersistence } from '../getAllAttendancesPersistence.js';

export async function createFakeAttendance() {
  const attendance: Array<AttendanceInterface> = [
    {
      group: faker.database.mongodbObjectId(),
      user: faker.database.mongodbObjectId(),
      photo: faker.image.url(),
      tagLocation: faker.location.street(),
      location: {
        name: faker.location.streetAddress(),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
      date: faker.date.recent(),
    },
    {
      group: faker.database.mongodbObjectId(),
      user: faker.database.mongodbObjectId(),
      photo: faker.image.url(),
      tagLocation: faker.location.street(),
      location: {
        name: faker.location.streetAddress(),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
      date: faker.date.recent(),
    },
  ];

  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db('pin-point');

    const attendancesCollection = db.collection('attendances');

    await attendancesCollection.insertMany(attendance);

    return getAllAttendancesPersistence(10, 1);
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}
