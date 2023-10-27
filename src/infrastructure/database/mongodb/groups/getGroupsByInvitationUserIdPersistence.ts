import { client } from '../index.js';

export async function getGroupsByInvitationUserIdPersistence(invitationUserId: string) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');
    const groupsCollection = db.collection('groups');

    const cursor = groupsCollection.find({
      invitations: {
        $elemMatch: {
          user: invitationUserId,
        },
      },
    });

    const result = await cursor.toArray();

    return result;
  } catch (err) {
    throw new Error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
