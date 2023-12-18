import { ObjectId } from 'mongodb';
import { client } from '../../index.js';

export async function createFakeNotification() {
  const data = [
    {
      _id: new ObjectId('656f26db866ff2a4d71a9b86'),
      type: 'request',
      message: 'user3 wants to support you',
      status: 'pending',
      date: new Date(),
    },
    {
      _id: new ObjectId('65705617d6202602897c78b1'),
      type: 'message',
      message: 'User 1 like your post',
      date: new Date(new Date(new Date().setDate(new Date().getDate() - 1))),
    },
    {
      _id: new ObjectId('656f3128b39ae757f78678f1'),
      type: 'message',
      message: 'User 2 like your post',
      date: new Date(),
    },
  ];

  try {
    const db = client.db('think-action');

    const notificationCollection = db.collection('notifications');

    await notificationCollection.insertMany(data);

    const result = await notificationCollection.find({}).toArray();

    return result;
  } catch (err) {
    throw new Error(err);
  }
}
