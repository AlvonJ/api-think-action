import { ObjectId } from 'mongodb';
import { client } from '../index.js';

export async function getAllSupporterPersistence(authUserId: string, userId: string, limit: number, page: number) {
  try {
    const db = client.db('think-action');
    const usersCollection = db.collection('users');

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Define the aggregation pipeline
    const pipeline = [
      { $match: { _id: new ObjectId(userId) } },
      { $unwind: '$supporter' },
      { $skip: +skip },
      { $limit: +limit },
      { $addFields: { isAuthenticatedUser: { $eq: [new ObjectId(authUserId), '$_id'] } } },
      {
        $lookup: {
          from: 'users',
          localField: 'supporter',
          foreignField: '_id',
          as: 'supporterDetails',
        },
      },
      { $unwind: '$supporterDetails' },
      {
        $addFields: {
          'supporterDetails.isSupporting': {
            $in: [new ObjectId(authUserId), '$supporterDetails.supporter'],
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$supporterDetails' },
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
    return data.map(supporter => ({
      ...supporter,
      isAuthenticatedUser: supporter._id.equals(new ObjectId(authUserId)),
    }));
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  }
}
