import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getCurrentUserRequestPersistence(authUserId: string, limit: number, page: number) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Define the aggregation pipeline
    const pipeline = [
      { $match: { _id: new ObjectId(authUserId) } },
      { $unwind: '$request' },
      { $skip: +skip },
      { $limit: +limit },
      {
        $lookup: {
          from: 'users',
          localField: 'request',
          foreignField: '_id',
          as: 'requestDetails',
        },
      },
      { $unwind: '$requestDetails' },
      {
        $addFields: {
          'requestDetails.isSupporting': {
            $in: [new ObjectId(authUserId), '$requestDetails.supporter'],
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$requestDetails' },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          email: 1,
          bio: 1,
          photo: 1,
          categoryResolution: 1,
          isPublic: 1,
          supporterCount: 1,
          supportingCount: 1,
          isSupporting: 1,
        },
      },
    ];

    const data = await usersCollection.aggregate(pipeline).toArray();

    return data;
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
