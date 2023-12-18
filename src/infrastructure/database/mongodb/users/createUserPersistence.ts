import { UserInterface } from '../../../../domain/entity/UserEntity.js';
import { client } from '../index.js';
import { getUserPersistence } from './getUserPersistence.js';

export async function createUserPersistence(user: UserInterface) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const result = await usersCollection.insertOne(user);

    const insertedUser = await getUserPersistence(result.insertedId.toString());

    return insertedUser;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
