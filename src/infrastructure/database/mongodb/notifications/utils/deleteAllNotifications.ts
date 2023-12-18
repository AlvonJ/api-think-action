import { client } from '../../index.js';

export async function deleteAllNotifications() {
  try {
    const db = client.db('think-action');

    const notificationCollection = db.collection('notifications');

    await notificationCollection.deleteMany({});
  } catch (err) {
    throw new Error(err);
  }
}
