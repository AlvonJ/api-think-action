import { client } from '../../index.js';

export async function deleteAllPosts() {
  try {
    const db = client.db('think-action');

    const postCollection = db.collection('posts');

    await postCollection.deleteMany({});
  } catch (err) {
    throw new Error(err);
  }
}
