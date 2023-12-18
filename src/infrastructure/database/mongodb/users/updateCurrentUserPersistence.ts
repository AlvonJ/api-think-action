import { ObjectId } from 'mongodb';
import { client } from '../index.js';
import { UserInterface } from '../../../../domain/entity/UserEntity.js';
import { getUserPersistence } from './getUserPersistence.js';

function cleanNullValues(obj: Object): void {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
}

export async function updateCurrentUserPersistence(authUserId: string, user: UserInterface) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const updateValues = {
      username: user.username,
      fullname: user.fullname,
      photo: user.photo,
      isPublic: user.isPublic,
      bio: user.bio,
    };

    cleanNullValues(updateValues);

    const updateUser = {
      $set: updateValues,
    };

    const result = await usersCollection.updateOne({ _id: new ObjectId(authUserId) }, updateUser);

    if (result.matchedCount === 0) throw new Error('No users found with that id!', { cause: 'DataNotFound' });

    return getUserPersistence(authUserId);
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
