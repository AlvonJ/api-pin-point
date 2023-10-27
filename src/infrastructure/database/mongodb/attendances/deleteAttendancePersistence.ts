import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function deleteAttendancePersistence(id: string) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const attendancesCollection = db.collection('attendances');

    const result = await attendancesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) throw new Error('No attendances found with that id!', { cause: 'DataNotFound' });
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
