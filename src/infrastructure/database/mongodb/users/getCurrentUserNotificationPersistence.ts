import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getCurrentUserNotificationPersistence(authUserId: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');
    const notificationCollection = db.collection('notifications');

    // Get the user's notifications array
    const user = await usersCollection.findOne({ _id: new ObjectId(authUserId) });
    if (!user) {
      throw new Error('User not found', { cause: 'DataNotFound' });
    }

    // Define today, yesterday, and the start of the week and month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Aggregate notifications
    const aggregatePipeline = [
      { $match: { _id: { $in: user.notification.map(id => new ObjectId(id)) } } },
      { $limit: 20 },
      {
        $addFields: {
          category: {
            $switch: {
              branches: [
                { case: { $gte: ['$date', today] }, then: 'today' },
                { case: { $gte: ['$date', yesterday] }, then: 'yesterday' },
                { case: { $gte: ['$date', thisWeek] }, then: 'thisWeek' },
                { case: { $gte: ['$date', thisMonth] }, then: 'thisMonth' },
              ],
              default: 'older',
            },
          },
        },
      },
      {
        $group: {
          _id: '$category',
          notifications: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          category: '$_id',
          notifications: 1,
        },
      },
    ];

    const categorizedNotifications = await notificationCollection.aggregate(aggregatePipeline).toArray();

    // Restructure the response
    const data = categorizedNotifications.reduce((acc, curr) => {
      acc[curr._id] = curr.notifications;
      return acc;
    }, {});

    return data;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
