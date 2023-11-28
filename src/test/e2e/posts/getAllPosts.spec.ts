import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get all posts example', () => {
  let app;
  let token;
  let user;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllPosts();
    await deleteAllUsers();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllPosts();
  });

  beforeAll(async () => {
    app = createApp();

    user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body;
  });

  it('should be able get all posts', async () => {
    const data = await createFakePost();

    const response = await request(app).get(`/v1/posts`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toBeDefined();

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[0].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[0].type);
    expect(response.body.data[0].caption).toEqual(data[0].caption);
    expect(response.body.data[0].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[0].userInfo).toBeDefined();

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].userId).toEqual(data[1].userId);
    expect(response.body.data[1].categoryResolutionId).toEqual(data[1].categoryResolutionId);
    expect(response.body.data[1].type).toEqual(data[1].type);
    expect(response.body.data[1].caption).toEqual(data[1].caption);
    expect(response.body.data[1].dueDate).toEqual(data[1].dueDate);
    expect(response.body.data[1].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[1].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[1].shareWith).toEqual(data[1].shareWith);
    expect(response.body.data[1].userInfo).toBeDefined();
  });

  it('should be able to filter get all posts', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts`)
      .query({ userId: user[0]._id.toString(), type: 'resolutions' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toBeDefined();

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(user[0]._id.toString());
    expect(response.body.data[0].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[0].type).toEqual('resolutions');
    expect(response.body.data[0].caption).toEqual(data[0].caption);
    expect(response.body.data[0].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[0].userInfo).toBeDefined();
  });

  it('should be able to limit results', async () => {
    await createFakePost();

    const response = await request(app).get('/v1/posts').query({ limit: 1 }).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
