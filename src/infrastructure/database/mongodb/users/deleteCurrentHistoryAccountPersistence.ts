import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function deleteCurrentHistoryAccountPersistence(authUserId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    // Update the specified user document
    await usersCollection.updateOne(
      { _id: new ObjectId(authUserId) },
      { $set: { historyAccount: [] } } // Set historyAccount to an empty array
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
