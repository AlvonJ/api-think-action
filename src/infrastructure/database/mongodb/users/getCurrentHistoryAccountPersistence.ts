import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getCurrentHistoryAccountPersistence(authUserId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const pipeline = [
      {
        $match: { _id: new ObjectId(authUserId) }, // Match the user by their ID
      },
      {
        $project: {
          historyAccount: { $slice: ['$historyAccount', -5] }, // Get the last 5 elements
        },
      },
      {
        $unwind: '$historyAccount', // Unwind the historyAccount array for $replaceRoot
      },
      {
        $replaceRoot: { newRoot: '$historyAccount' }, // Promote historyAccount objects to top level
      },
    ];

    const result = (await usersCollection.aggregate(pipeline).toArray()).reverse();

    return result; // Returns an array of historyAccount objects
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
