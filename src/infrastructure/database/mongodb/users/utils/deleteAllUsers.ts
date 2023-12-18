import { client } from '../../index.js';

export async function deleteAllUsers() {
  try {
    const db = client.db('think-action');

    const usersCollection = db.collection('users');

    await usersCollection.deleteMany({});
  } catch (err) {
    throw new Error(err);
  }
}
