import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function rejectSupportRequestPersistence(authUserId: string, userId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const userToReject = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!userToReject) {
      throw new Error('User not found or not requested', { cause: 'DataNotFound' });
    }

    // Begin a session for a transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $pull: { request: new ObjectId(authUserId) },
            $inc: { requestCount: -1 },
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
