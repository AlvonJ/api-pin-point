import { client } from '../index.js';

export async function resetDatabase() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
