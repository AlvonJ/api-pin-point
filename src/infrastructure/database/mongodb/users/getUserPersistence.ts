import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getUserPersistence(id: string, projection: boolean = true) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const usersCollection = db.collection('users');

    let exclude;

    if (projection) {
      exclude = {
        projection: { password: 0 },
      };
    } else {
      exclude = {};
    }

    const result = await usersCollection.findOne({ _id: new ObjectId(id) }, exclude);

    return result;
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
