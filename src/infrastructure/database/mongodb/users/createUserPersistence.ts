import { UserInterface } from '../../../../domain/entity/UserEntity.js';
import { client } from '../index.js';
import { getUserPersistence } from './getUserPersistence.js';

export async function createUserPersistence(user: UserInterface) {
  try {
    await client.connect();

    const db = client.db('pin-point');
    const usersCollection = db.collection('users');

    // Use a case-insensitive regex to search for duplicate
    const isFoundDuplicate = await usersCollection.findOne({
      email: { $regex: new RegExp(`^${user.email}$`, 'i') },
    });

    if (isFoundDuplicate) throw new Error('Email has already been registered', { cause: 'DuplicateError' });

    const result = await usersCollection.insertOne(user);

    const insertedUser = await getUserPersistence(result.insertedId.toString());

    return insertedUser;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    await client.close();
  }
}
