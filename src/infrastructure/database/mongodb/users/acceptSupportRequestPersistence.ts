import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function acceptSupportRequestPersistence(authUserId: string, userId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const userToAccept = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!userToAccept) {
      throw new Error('User not found or not requested', { cause: 'DataNotFound' });
    }

    // Begin a session for a transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $addToSet: { supporter: new ObjectId(authUserId) },
            $pull: { request: new ObjectId(authUserId) },
            $inc: { supporterCount: 1, requestCount: -1 },
          },
          { session }
        );

        await usersCollection.updateOne(
          { _id: new ObjectId(authUserId) },
          {
            $addToSet: { supporting: new ObjectId(userId) },
            $inc: { supportingCount: 1 },
          },
          { session }
        );
      });

      // Fetch the updated user data
      const updatedUser = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { supporterCount: 1, isPublic: 1 } }
      );

      return updatedUser;
    } finally {
      await session.endSession();
    }
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
