import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getAttendancePersistence(id: string) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const attendancesCollection = db.collection('attendances');

    const result = await attendancesCollection.findOne({ _id: new ObjectId(id) });

    return result;
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
