import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllComments } from '../../../infrastructure/database/mongodb/comments/utils/deleteAllComments.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';
import { createFakeComment } from '../../../infrastructure/database/mongodb/comments/utils/createFakeComment.js';

describe('create one reply example', () => {
  let app;
  let token;
  let user;
  let post;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllComments();
    await deleteAllUsers();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllComments();
  });

  beforeAll(async () => {
    app = createApp();

    user = await createFakeUser();
    post = await createFakePost();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body;
  });

  it('should be able create one reply', async () => {
    const data = createFakeComment();

    const response = await request(app).post(`/v1/comments/reply`).set('Authorization', `Bearer ${token}`).send({
      userId: user[0]._id.toString(),
      postId: post[0]._id.toString(),
      replyTo: data[0]._id.toString(),
      message: 'This is reply comment!',
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.comment._id.toString()).toBeDefined();
    expect(response.body.data.comment.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.comment.postId).toEqual(post[0]._id.toString());
    expect(response.body.data.comment.message).toEqual('This is reply comment!');
    expect(response.body.data.comment.replyCount).toEqual(0);
    expect(response.body.data.comment.createdDate).toBeDefined();
    expect(response.body.data.comment.updatedDate).toBeNull();
    expect(response.body.data.comment.userInfo).toBeDefined();

    expect(response.body.data.parentComment._id.toString()).toBeDefined();
    expect(response.body.data.parentComment.userId).toEqual(data[0].userId.toString());
    expect(response.body.data.parentComment.postId).toEqual(data[0].postId.toString());
    expect(response.body.data.parentComment.message).toEqual(data[0].message);
    expect(response.body.data.parentComment.replyCount).toEqual(data[0].replyCount + 1);
    expect(response.body.data.parentComment.createdDate).toEqual(data[0].createdDate);
    expect(response.body.data.parentComment.updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data.parentComment.userInfo).toBeDefined();
  });

  it('should thrown error if user id is not found', async () => {
    const data = createFakeComment();

    const response = await request(app).post(`/v1/comments/reply`).set('Authorization', `Bearer ${token}`).send({
      userId: '12325320b7681b6c0b567bd5',
      postId: post[0]._id.toString(),
      replyTo: data[0]._id.toString(),
      message: 'This is reply comment!',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if post id is not found', async () => {
    const data = createFakeComment();

    const response = await request(app).post(`/v1/comments/reply`).set('Authorization', `Bearer ${token}`).send({
      userId: user[0]._id.toString(),
      postId: '12325320b7681b6c0b567bd5',
      replyTo: data[0]._id.toString(),
      message: 'This is reply comment!',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if replyTo id is not found', async () => {
    const data = createFakeComment();

    const response = await request(app).post(`/v1/comments/reply`).set('Authorization', `Bearer ${token}`).send({
      userId: user[0]._id.toString(),
      postId: post[0]._id.toString(),
      replyTo: '12325320b7681b6c0b567bd5',
      message: 'This is reply comment!',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).post('/v1/comments');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
