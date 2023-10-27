import { GroupInterface } from '../../../../../domain/entity/GroupEntity.js';
import { faker } from '@faker-js/faker';
import { client } from '../../index.js';
import { getAllGroupsPersistence } from '../getAllGroupsPersistence.js';

export async function createFakeGroup() {
  const group: Array<GroupInterface> = [
    {
      name: faker.location.city(),
      admin: faker.database.mongodbObjectId(),
      member: [faker.database.mongodbObjectId()],
      tagLocation: [faker.location.street(), faker.location.street()],
      invitations: [
        { user: faker.database.mongodbObjectId(), status: 'pending' },
        { user: faker.database.mongodbObjectId(), status: 'rejected', message: "I don't want to join" },
      ],
    },
    {
      name: faker.location.city(),
      admin: faker.database.mongodbObjectId(),
      member: [faker.database.mongodbObjectId()],
      tagLocation: [faker.location.street(), faker.location.street()],
      invitations: [
        { user: faker.database.mongodbObjectId(), status: 'pending' },
        { user: faker.database.mongodbObjectId(), status: 'rejected', message: "I don't want to join" },
      ],
    },
  ];

  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db('pin-point');

    const groupsCollection = db.collection('groups');

    await groupsCollection.insertMany(group);

    return getAllGroupsPersistence(10, 1);
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}
