import { client } from '../index.js';

export async function getUserByEmailPersistence(email: string) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const usersCollection = db.collection('users');

    const result = await usersCollection.findOne({ email });

    return result;
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
