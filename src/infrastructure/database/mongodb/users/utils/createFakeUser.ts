import bcrypt from 'bcrypt';
import { UserInterface } from '../../../../../domain/entity/UserEntity.js';
import { faker } from '@faker-js/faker';
import { client } from '../../index.js';
import { getAllUserPersistence } from '../getAllUsersPersistence.js';

export async function createFakeUser() {
  const password = await bcrypt.hash('12345678', 10);

  const user: Array<UserInterface> = [
    {
      password,
      email: faker.internet.email(),
      username: faker.person.firstName(),
      phone: faker.number.int().toString(),
      photo: faker.image.url(),
      role: 'admin',
    },
    {
      password,
      email: faker.internet.email(),
      username: faker.person.firstName(),
      phone: faker.number.int().toString(),
      photo: faker.image.url(),
      role: 'user',
    },
  ];

  try {
    // Connect the client to the server
    await client.connect();
    const db = client.db('pin-point');

    const usersCollection = db.collection('users');

    await usersCollection.insertMany(user);

    return getAllUserPersistence(10, 1);
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}
