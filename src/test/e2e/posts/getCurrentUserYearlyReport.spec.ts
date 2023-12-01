import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get current user yearly report example', () => {
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

  it('should be able get current user yearly report', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/yearly`)
      .query({ year: 2023 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.percentage).toBeDefined();
    expect(response.body.data.week1).toBeDefined();
    expect(response.body.data.week2).toBeDefined();
    expect(response.body.data.week3).toBeDefined();
    expect(response.body.data.week4).toBeDefined();
    expect(response.body.data.week6).toBeDefined();
    expect(response.body.data.week7).toBeDefined();
    expect(response.body.data.week8).toBeDefined();
    expect(response.body.data.week9).toBeDefined();
    expect(response.body.data.week10).toBeDefined();
    expect(response.body.data.week11).toBeDefined();
    expect(response.body.data.week12).toBeDefined();
    expect(response.body.data.week13).toBeDefined();
    expect(response.body.data.week14).toBeDefined();
    expect(response.body.data.week15).toBeDefined();
    expect(response.body.data.week16).toBeDefined();
    expect(response.body.data.week17).toBeDefined();
    expect(response.body.data.week18).toBeDefined();
    expect(response.body.data.week19).toBeDefined();
    expect(response.body.data.week20).toBeDefined();
    expect(response.body.data.week21).toBeDefined();
    expect(response.body.data.week22).toBeDefined();
    expect(response.body.data.week23).toBeDefined();
    expect(response.body.data.week24).toBeDefined();
    expect(response.body.data.week25).toBeDefined();
    expect(response.body.data.week26).toBeDefined();
    expect(response.body.data.week27).toBeDefined();
    expect(response.body.data.week28).toBeDefined();
    expect(response.body.data.week29).toBeDefined();
    expect(response.body.data.week30).toBeDefined();
    expect(response.body.data.week31).toBeDefined();
    expect(response.body.data.week33).toBeDefined();
    expect(response.body.data.week34).toBeDefined();
    expect(response.body.data.week35).toBeDefined();
    expect(response.body.data.week36).toBeDefined();
    expect(response.body.data.week37).toBeDefined();
    expect(response.body.data.week38).toBeDefined();
    expect(response.body.data.week39).toBeDefined();
    expect(response.body.data.week40).toBeDefined();
    expect(response.body.data.week41).toBeDefined();
    expect(response.body.data.week42).toBeDefined();
    expect(response.body.data.week43).toBeDefined();
    expect(response.body.data.week44).toBeDefined();
    expect(response.body.data.week45).toBeDefined();
    expect(response.body.data.week47).toBeDefined();
    expect(response.body.data.week48).toBeDefined();
    expect(response.body.data.week49).toBeDefined();
    expect(response.body.data.week50).toBeDefined();
    expect(response.body.data.week51).toBeDefined();
    expect(response.body.data.week52).toBeDefined();
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts/yearly');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
