import { ObjectId } from 'mongodb';
import { client } from '../../index.js';

export async function createFakeComment() {
  const data = [
    {
      _id: new ObjectId('656f2cca106f22d6f80eadc3'),
      userId: new ObjectId('656f261a40adaa0c43b3e679'),
      postId: new ObjectId('656f2ced6b61426bb1923292'),
      message: 'This is comment 1',
      reply: [new ObjectId('656f30033229fc39c1207c3d')],
      type: 'comment',
      createdDate: new Date(),
      updatedDate: null,
    },
    {
      _id: new ObjectId('656f2e8a49d7eb60d9698662'),
      userId: new ObjectId('656f26663094a2fe958943b4'),
      postId: new ObjectId('656f2ced6b61426bb1923292'),
      message: 'This is comment 2',
      type: 'comment',
      reply: [],
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1))),
      updatedDate: null,
    },
    {
      _id: new ObjectId('656f30033229fc39c1207c3d'),
      userId: new ObjectId('656f266de12a3289f1398ea9'),
      postId: new ObjectId('656f2ced6b61426bb1923292'),
      message: 'This is reply 1',
      type: 'reply',
      reply: [],
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 2))),
      updatedDate: null,
    },
  ];

  try {
    const db = client.db('think-action');

    const commentsCollection = db.collection('comments');

    await commentsCollection.insertMany(data);

    const result = await commentsCollection.find({}).toArray();

    return result;
  } catch (err) {
    throw new Error(err);
  }
}
