import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getAllSupportingPersistence(authUserId: string, userId: string, limit: number, page: number) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Define the aggregation pipeline
    const pipeline = [
      { $match: { _id: new ObjectId(userId) } },
      { $unwind: '$supporting' },
      { $skip: +skip },
      { $limit: +limit },
      {
        $lookup: {
          from: 'users',
          localField: 'supporting',
          foreignField: '_id',
          as: 'supportingDetails',
        },
      },
      { $unwind: '$supportingDetails' },
      {
        $addFields: {
          'supportingDetails.isSupporting': {
            $in: [new ObjectId(authUserId), '$supportingDetails.supporter'],
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$supportingDetails' },
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
    return data.map(supporting => ({
      ...supporting,
      isAuthenticatedUser: supporting._id.equals(new ObjectId(authUserId)),
    }));
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
