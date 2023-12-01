import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get current user monthly report example', () => {
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

  it('should be able get current user monthly report', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/monthly`)
      .query({ month: 12 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.percentage).toBeDefined();
    expect(response.body.data.week1).toBeDefined();
    expect(response.body.data.week2).toBeDefined();
    expect(response.body.data.week3).toBeDefined();
    expect(response.body.data.week4).toBeDefined();
    expect(response.body.data.week5).toBeDefined();
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts/monthly');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
