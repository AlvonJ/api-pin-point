import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function deleteUserPersistence(id: string) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const usersCollection = db.collection('users');

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) throw new Error('No users found with that id!', { cause: 'DataNotFound' });
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
