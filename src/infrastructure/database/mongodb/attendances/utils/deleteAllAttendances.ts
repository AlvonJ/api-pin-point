import { client } from '../../index.js';

export async function deleteAllAttendances() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const usersCollection = db.collection('attendances');

    await usersCollection.deleteMany({});
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
