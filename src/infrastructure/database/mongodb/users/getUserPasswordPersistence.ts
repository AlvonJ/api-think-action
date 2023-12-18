import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getUserPasswordPersistence(id: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      {
        $project: {
          password: 1,
        },
      },
    ];

    const result = await usersCollection.aggregate(pipeline).toArray();
    return result[0] || null; // Returns the first element of the result array or null if empty
  } catch (err) {
    throw new Error(err);
  }
}
