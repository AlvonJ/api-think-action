import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function searchUserAccountPersistence(authUserId: string, username: string) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    // Get the users that the authenticated user is supporting
    const authUser = await usersCollection.findOne({ _id: new ObjectId(authUserId) });
    const supportingIds = authUser.supporting;

    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          username: { $regex: new RegExp('.*' + username + '.*', 'i') },
        },
      },
      {
        $limit: 5, // Limit the results to 5 documents
      },
      {
        $lookup: {
          from: 'users',
          localField: 'supporter',
          foreignField: '_id',
          as: 'supportedByDetails',
        },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          username: 1,
          photo: 1,
          supportedBy: {
            $filter: {
              input: '$supportedByDetails',
              as: 'item',
              cond: { $in: ['$$item._id', supportingIds] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          username: 1,
          photo: 1,
          supportedByCount: { $size: '$supportedBy' },
          supportedBy: { $slice: ['$supportedBy', 1] },
        },
      },
      {
        $addFields: {
          supportedBy: {
            $map: {
              input: '$supportedBy',
              as: 's',
              in: {
                _id: '$$s._id',
                username: '$$s.username',
              },
            },
          },
        },
      },
    ];

    const data = await usersCollection.aggregate(pipeline).toArray();

    await usersCollection.updateOne({ _id: new ObjectId(authUserId) }, { $addToSet: { historyAccount: data[0] } });
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}
