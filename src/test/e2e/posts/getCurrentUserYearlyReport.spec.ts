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
      .send({ email: user[1].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be able get current user yearly report', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/yearly`)
      .query({ year: 2023 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.percentage).toEqual(0);

    for (let week = 1; week <= 52; week++) {
      expect(response.body.data[`week${week}`]).toBeDefined();

      expect(response.body.data[`week${week}`].fitness).toEqual(false);
    }
  });

  it('should be able get current user yearly report (user 4)', async () => {
    const data = await createFakePost();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[4].email, password: '12345678' });

    const token = authResponse.body.token;

    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Fitness',
        caption: 'I want to get Rp 30.000.000',
        dueDate: `${new Date().getFullYear() + 1}-12-31`,
        shareWith: 'private',
        photo: ['linkphoto1.png'],
      });

    const response2 = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: response.body.data.categoryResolutionId.toString(),
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: `${new Date().getFullYear() + 1}-12-30`,
        shareWith: 'private',
        photo: ['linkphoto1.png'],
      });

    const response3 = await request(app)
      .post(`/v1/posts/completeGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: response.body.data.categoryResolutionId.toString(),
        weeklyGoalId: response2.body.data._id.toString(),
        caption: 'I already completed this weekly goal',
        shareWith: 'private',
        photo: ['linkphoto1.png'],
        isComplete: false,
      });

    const response4 = await request(app)
      .get(`/v1/posts/yearly`)
      .query({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.percentage).toEqual(0.5);

    for (let week = 1; week <= 52; week++) {
      expect(response.body.data[`week${week}`]).toBeDefined();

      if (week === 52) {
        expect(response.body.data[`week${week}`].fitness).toEqual(true);
      }

      expect(response.body.data[`week${week}`].fitness).toEqual(false);
    }
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts/yearly');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
