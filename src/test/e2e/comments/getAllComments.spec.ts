import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeComment } from '../../../infrastructure/database/mongodb/comments/utils/createFakeComment.js';
import { deleteAllComments } from '../../../infrastructure/database/mongodb/comments/utils/deleteAllComments.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('get all notifications example', () => {
  let app;
  let token;

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

    const user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body;
  });

  it('should be able get all comments', async () => {
    const data = await createFakeComment();

    const response = await request(app).get(`/v1/comments`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toBeDefined();

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].postId).toEqual(data[0].postId);
    expect(response.body.data[0].userId).toEqual(data[0].userId);
    expect(response.body.data[0].message).toEqual(data[0].message);
    expect(response.body.data[0].replyCount).toEqual(data[0].replyCount);
    expect(response.body.data[0].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[0].userInfo).toBeDefined();

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].postId).toEqual(data[1].postId);
    expect(response.body.data[1].userId).toEqual(data[1].userId);
    expect(response.body.data[1].message).toEqual(data[1].message);
    expect(response.body.data[1].replyCount).toEqual(data[1].replyCount);
    expect(response.body.data[1].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[1].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[1].userInfo).toBeDefined();
  });

  it('should be able to limit results', async () => {
    await createFakeComment();

    const response = await request(app).get('/v1/comments').query({ limit: 1 }).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/comments');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
