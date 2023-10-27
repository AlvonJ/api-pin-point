import { client } from '../index.js';

export async function getAllAttendancesPersistence(
  limit: number,
  page: number,
  startDate?: Date,
  endDate?: Date,
  userId?: string
) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');
    const attendancesCollection = db.collection('attendances');

    // Create an empty filter object
    const filter: any = {};

    // Add conditions to the filter based on non-null parameters
    if (startDate) {
      filter.date = {
        $gte: new Date(startDate), // Greater than or equal to startDate
      };
    }

    if (endDate) {
      filter.date = filter.date || {};
      filter.date.$lte = new Date(endDate); // Less than or equal to endDate
    }

    if (userId) {
      const arrayUserId = userId.split(',');

      if (arrayUserId.length > 0) filter.user = { $in: arrayUserId }; // Matches userId from the provided array
    }

    const cursor = attendancesCollection
      .find(filter)
      .limit(+limit)
      .skip((page - 1) * limit);

    const result = await cursor.toArray();

    await cursor.close();

    return result;
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
