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
    token = authResponse.body.token;
  });

  it('should be able get current user monthly report (user 0)', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/monthly`)
      .query({ month: new Date().getMonth(), year: new Date().getFullYear() })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.percentage).toEqual(0);
    expect(response.body.data.week1).toBeDefined();
    expect(response.body.data.week1.finance).toEqual(false);

    expect(response.body.data.week2).toBeDefined();
    expect(response.body.data.week2.finance).toEqual(false);

    expect(response.body.data.week3).toBeDefined();
    expect(response.body.data.week3.finance).toEqual(false);

    expect(response.body.data.week4).toBeDefined();
    expect(response.body.data.week4.finance).toEqual(false);

    expect(response.body.data.week5).toBeDefined();
    expect(response.body.data.week5.finance).toEqual(false);
  });

  it('should be able get current user monthly report (user 1)', async () => {
    const data = await createFakePost();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[1].email, password: '12345678' });

    const token = authResponse.body.token;

    const response = await request(app)
      .get(`/v1/posts/monthly`)
      .query({ month: new Date().getMonth(), year: new Date().getFullYear() })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.percentage).toEqual(0);
    expect(response.body.data.week1).toBeDefined();
    expect(response.body.data.week1.fitness).toEqual(false);

    expect(response.body.data.week2).toBeDefined();
    expect(response.body.data.week2.fitness).toEqual(false);

    expect(response.body.data.week3).toBeDefined();
    expect(response.body.data.week3.fitness).toEqual(false);

    expect(response.body.data.week4).toBeDefined();
    expect(response.body.data.week4.fitness).toEqual(false);

    expect(response.body.data.week5).toBeDefined();
    expect(response.body.data.week5.fitness).toEqual(false);
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts/monthly');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
