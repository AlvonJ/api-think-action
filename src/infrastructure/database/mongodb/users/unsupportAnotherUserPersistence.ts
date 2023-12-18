import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function unsupportAnotherUserPersistence(authUserId: string, userId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const userToUnsupport = await usersCollection.findOne({
      _id: new ObjectId(userId),
      supporter: new ObjectId(authUserId),
    });

    if (!userToUnsupport) {
      throw new Error('User not found or not supported', { cause: 'DataNotFound' });
    }

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Remove authUserId from the supporter array of userId and decrement supporterCount
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $pull: { supporter: new ObjectId(authUserId) },
            $inc: { supporterCount: -1 },
          },
          { session }
        );

        // Remove userId from the supporting array of authUserId and decrement supportingCount
        await usersCollection.updateOne(
          { _id: new ObjectId(authUserId) },
          {
            $pull: { supporting: new ObjectId(userId) },
            $inc: { supportingCount: -1 },
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // Fetch and return the updated user data
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { supporterCount: 1, isPublic: 1 } }
    );

    return updatedUser;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
