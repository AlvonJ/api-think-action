import bcrypt from 'bcrypt';
import { client } from '../../index.js';
import { ObjectId } from 'mongodb';

export async function createFakeUser() {
  const password = await bcrypt.hash('12345678', 10);

  const data = [
    {
      _id: new ObjectId('656f261a40adaa0c43b3e679'),
      fullname: 'User 0',
      username: 'user0',
      email: 'user0@gmail.com',
      password,
      bio: 'Bio User 0',
      photo: 'user0.png',
      supporter: [new ObjectId('656f26663094a2fe958943b4'), new ObjectId('656f266de12a3289f1398ea9')],
      supporting: [new ObjectId('656f26663094a2fe958943b4'), new ObjectId('656f266de12a3289f1398ea9')],
      request: [new ObjectId('656f26d2b93ef5dd1a5c953d')],
      notification: [new ObjectId('656f26db866ff2a4d71a9b86'), new ObjectId('65705617d6202602897c78b1')],
      supporterCount: 2,
      supportingCount: 2,
      requestCount: 1,
      notificationCount: 2,
      categoryResolution: [
        {
          _id: new ObjectId('656f26db866ff2a4d71a9b86'),
          name: 'Finance',
          resolution: 'Have a bunch of money in a year',
          isComplete: false,
          createdDate: new Date(),
        },
      ],
      historyAccount: [
        {
          _id: new ObjectId('657fb542e6af9505c74f537d'),
          username: 'Test3',
          fullname: null,
          photo: null,
          supportedByCount: 0,
          supportedBy: [],
        },
      ],
      isPublic: true,
    },
    {
      _id: new ObjectId('656f26663094a2fe958943b4'),
      fullname: 'User 1',
      username: 'user1',
      email: 'user1@gmail.com',
      password,
      bio: 'Bio User 1',
      photo: 'user1.png',
      supporter: [new ObjectId('656f261a40adaa0c43b3e679'), new ObjectId('656f266de12a3289f1398ea9')],
      supporting: [new ObjectId('656f261a40adaa0c43b3e679')],
      request: [],
      notification: [new ObjectId('656f3128b39ae757f78678f1')],
      supporterCount: 2,
      supportingCount: 1,
      requestCount: 0,
      notificationCount: 1,
      categoryResolution: [
        {
          _id: new ObjectId('656f29a2198443d135af03d6'),
          name: 'Fitness',
          resolution: 'Go to GYM in a year',
          isComplete: false,
          createdDate: new Date(),
        },
      ],
      historyAccount: [],
      isPublic: false,
    },
    {
      _id: new ObjectId('656f266de12a3289f1398ea9'),
      fullname: 'User 2',
      username: 'user2',
      email: 'user2@gmail.com',
      password,
      bio: 'Bio User 2',
      photo: 'user2.png',
      supporter: [new ObjectId('656f261a40adaa0c43b3e679')],
      supporting: [new ObjectId('656f261a40adaa0c43b3e679'), new ObjectId('656f26663094a2fe958943b4')],
      request: [],
      notification: [],
      supporterCount: 1,
      supportingCount: 2,
      requestCount: 0,
      notificationCount: 0,
      categoryResolution: [],
      historyAccount: [],
      isPublic: true,
    },
    {
      _id: new ObjectId('656f26d2b93ef5dd1a5c953d'),
      fullname: 'User 3',
      username: 'user3',
      email: 'user3@gmail.com',
      password,
      bio: 'Bio User 3',
      photo: 'user3.png',
      supporter: [],
      supporting: [],
      request: [],
      notification: [],
      supporterCount: 0,
      supportingCount: 0,
      requestCount: 0,
      notificationCount: 0,
      categoryResolution: [],
      historyAccount: [],
      isPublic: true,
    },
    {
      _id: new ObjectId('65794ff2991e9b54f114eaf5'),
      fullname: 'User 4',
      username: 'user4',
      email: 'user4@gmail.com',
      password,
      bio: 'Bio User 4',
      photo: 'user4.png',
      supporter: [],
      supporting: [],
      request: [],
      notification: [],
      supporterCount: 0,
      supportingCount: 0,
      requestCount: 0,
      notificationCount: 0,
      categoryResolution: [],
      historyAccount: [],
      isPublic: false,
    },
  ];

  try {
    const db = client.db('think-action');

    const usersCollection = db.collection('users');

    await usersCollection.insertMany(data);

    const result = await usersCollection.find({}, { projection: { password: 0 } }).toArray();

    return result;
  } catch (err) {
    throw new Error(err);
  }
}
