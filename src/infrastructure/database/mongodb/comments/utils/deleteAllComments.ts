import { client } from '../../index.js';

export async function deleteAllComments() {
  try {
    const db = client.db('think-action');

    const commentCollection = db.collection('comments');

    await commentCollection.deleteMany({});
  } catch (err) {
    throw new Error(err);
  }
}
