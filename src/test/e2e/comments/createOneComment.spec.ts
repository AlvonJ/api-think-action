import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllComments } from '../../../infrastructure/database/mongodb/comments/utils/deleteAllComments.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('create one comment example', () => {
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

  it('should be able create one comment', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      userId: user[0]._id.toString(),
      postId: post[0]._id.toString(),
      message: 'This is new comment!',
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.postId).toEqual(post[0]._id.toString());
    expect(response.body.data.message).toEqual('This is new comment!');
    expect(response.body.data.replyCount).toEqual(0);
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should thrown error if user id is not found', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      userId: '12325320b7681b6c0b567bd5',
      postId: post[0]._id.toString(),
      message: 'This is new comment!',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if post id is not found', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      userId: user[0]._id.toString(),
      postId: '12325320b7681b6c0b567bd5',
      message: 'This is new comment!',
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
