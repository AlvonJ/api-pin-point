import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function deleteGroupPersistence(id: string) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const groupsCollection = db.collection('groups');

    const result = await groupsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) throw new Error('No groups found with that id!', { cause: 'DataNotFound' });
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
