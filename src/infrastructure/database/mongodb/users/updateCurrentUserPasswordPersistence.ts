import { ObjectId } from 'mongodb';
import { client } from '../index.js';
import { UserInterface } from '../../../../domain/entity/UserEntity.js';
import { getUserPersistence } from './getUserPersistence.js';

export async function updateCurrentUserPasswordPersistence(authUserId: string, user: UserInterface) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const updateUser = {
      $set: {
        password: user.password,
      },
    };

    const result = await usersCollection.updateOne({ _id: new ObjectId(authUserId) }, updateUser);

    if (result.matchedCount === 0) throw new Error('No users found with that id!', { cause: 'DataNotFound' });

    return getUserPersistence(authUserId);
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
