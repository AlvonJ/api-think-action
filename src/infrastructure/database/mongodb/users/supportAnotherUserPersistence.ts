import { ObjectId } from 'mongodb';
import { client } from '../index.js';
import { getUserPersistence } from './getUserPersistence.js';

export async function supportAnotherUserPersistence(authUserId: string, userId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');
    const notificationsCollection = db.collection('notifications');

    // First, check if the user is public
    const userToSupport = await usersCollection.findOne({
      _id: new ObjectId(userId),
      $and: [
        {
          supporter: { $ne: new ObjectId(authUserId) },
        },
        {
          request: { $ne: new ObjectId(authUserId) },
        },
      ],
    });

    const authUser = await getUserPersistence(authUserId);

    if (!userToSupport) {
      throw new Error('User not found or already supported', { cause: 'DataNotFound' });
    }

    // Begin a session for a transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        if (userToSupport.isPublic) {
          const notification = await notificationsCollection.insertOne({
            type: 'message',
            message: `${authUser.username} has supported you`,
            date: new Date(),
          });

          // If user is public, add to supporter array and increment supporterCount
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $addToSet: { supporter: new ObjectId(authUserId), notification: notification.insertedId },
              $inc: { supporterCount: 1, notificationCount: 1 },
            },
            { session }
          );

          // Also update the authUser's supporting array and supportingCount
          await usersCollection.updateOne(
            { _id: new ObjectId(authUserId) },
            {
              $addToSet: { supporting: new ObjectId(userId) },
              $inc: { supportingCount: 1 },
            },
            { session }
          );
        } else {
          const notification = await notificationsCollection.insertOne({
            type: 'request',
            message: `${authUser.username} wants to support you`,
            status: 'pending',
            date: new Date(),
          });

          // If user is not public, add to request array
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $addToSet: { request: new ObjectId(authUserId), notification: notification.insertedId },
              $inc: { requestCount: 1, notificationCount: 1 },
            },
            { session }
          );
        }
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
