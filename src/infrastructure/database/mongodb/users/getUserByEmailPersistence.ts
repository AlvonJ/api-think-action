import { client } from '../index.js';

export async function getUserByEmailPersistence(email: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    const pipeline = [
      { $match: { email } },
      {
        $project: {
          fullname: 1,
          username: 1,
          password: 1,
          email: 1,
          bio: 1,
          photo: 1,
          categoryResolution: 1,
          isPublic: 1,
          supporterCount: 1,
          supportingCount: 1,
        },
      },
    ];

    const result = await usersCollection.aggregate(pipeline).toArray();
    return result[0] || null; // Returns the first element of the result array or null if empty
  } catch (err) {
    throw new Error(err);
  }
}
