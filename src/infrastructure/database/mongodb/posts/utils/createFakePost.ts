import { ObjectId } from 'mongodb';
import { client } from '../../index.js';

export async function createFakePost() {
  const data = [
    {
      _id: new ObjectId('656f2ced6b61426bb1923292'),
      userId: new ObjectId('656f261a40adaa0c43b3e679'),
      categoryResolutionId: new ObjectId('656f26db866ff2a4d71a9b86'),
      type: 'resolutions',
      caption: 'This is resolution for post 1',
      photo: ['photo1.png'],
      like: [
        new ObjectId('656f261a40adaa0c43b3e679'),
        new ObjectId('656f26663094a2fe958943b4'),
        new ObjectId('656f266de12a3289f1398ea9'),
        new ObjectId('656f26d2b93ef5dd1a5c953d'),
      ],
      likeCount: 4,
      commentCount: 3,
      dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      createdDate: new Date(),
      updatedDate: null,
      shareWith: 'everyone',
      isComplete: false,
    },
    {
      _id: new ObjectId('65703a6d4da8360e96f5b2f2'),
      userId: new ObjectId('656f261a40adaa0c43b3e679'),
      categoryResolutionId: new ObjectId('656f26db866ff2a4d71a9b86'),
      type: 'weeklyGoals',
      caption: 'This is weekly goals for post 1',
      photo: ['photo1.png'],
      like: [],
      likeCount: 0,
      commentCount: 0,
      dueDate: new Date(new Date(new Date().setDate(new Date().getDate() + 8))),
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1))),
      updatedDate: null,
      shareWith: 'supporter',
      isComplete: false,
    },
    {
      _id: new ObjectId('656f34311fe90d6212e6b676'),
      userId: new ObjectId('656f26663094a2fe958943b4'),
      categoryResolutionId: new ObjectId('656f29a2198443d135af03d6'),
      type: 'resolutions',
      caption: 'This is resolution for post 2',
      photo: ['photo1.png'],
      like: [new ObjectId('656f261a40adaa0c43b3e679')],
      likeCount: 1,
      commentCount: 0,
      dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 2))),
      updatedDate: null,
      shareWith: 'everyone',
      isComplete: false,
    },
    {
      _id: new ObjectId('656f344f4a52cbd796057dd1'),
      userId: new ObjectId('656f26663094a2fe958943b4'),
      categoryResolutionId: new ObjectId('656f29a2198443d135af03d6'),
      type: 'weeklyGoals',
      caption: 'This is weekly goal for post 2',
      photo: ['photo2.png'],
      like: [],
      likeCount: 0,
      dueDate: new Date(new Date(new Date().setDate(new Date().getDate() + 10))),
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 3))),
      updatedDate: null,
      shareWith: 'private',
      isComplete: false,
    },
  ];

  try {
    const db = client.db('think-action');

    const postCollection = db.collection('posts');

    await postCollection.insertMany(data);

    const result = await postCollection.find({}).toArray();

    return result;
  } catch (err) {
    throw new Error(err);
  }
}
