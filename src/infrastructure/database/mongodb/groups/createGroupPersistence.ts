import { GroupInterface } from '../../../../domain/entity/GroupEntity.js';
import { client } from '../index.js';
import { getGroupPersistence } from './getGroupPersistence.js';

export async function createGroupPersistence(group: GroupInterface) {
  try {
    await client.connect();

    const db = client.db('pin-point');
    const groupsCollection = db.collection('groups');

    const isFoundDuplicate = await groupsCollection.findOne({
      name: { $regex: new RegExp(`^${group.name}$`, 'i') },
    });

    if (isFoundDuplicate) throw new Error('Name of group has already been taken', { cause: 'DuplicateError' });

    const result = await groupsCollection.insertOne(group);

    const insertedGroup = await getGroupPersistence(result.insertedId.toString());

    return insertedGroup;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    await client.close();
  }
}
