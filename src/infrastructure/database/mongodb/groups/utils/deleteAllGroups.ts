import { client } from '../../index.js';

export async function deleteAllGroups() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const usersCollection = db.collection('groups');

    await usersCollection.deleteMany({});
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
