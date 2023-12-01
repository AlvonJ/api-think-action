import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('create one weekly goal example', () => {
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

  it('should be able create one weekly goal (everyone)', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryResolutionId: data[0].categoryResolutionId.toString(),
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toEqual(data[0].categoryResolutionId.toString());
    expect(response.body.data.type).toEqual('weeklyGoals');
    expect(response.body.data.caption).toEqual('I want to get Rp 5.000.000 this week');
    expect(response.body.data.photo).toEqual(['linkphoto1.com']);
    expect(response.body.data.shareWith).toEqual('everyone');
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should be able create one weekly goal (private)', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryResolutionId: data[0].categoryResolutionId.toString(),
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'private',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toEqual(data[0].categoryResolutionId.toString());
    expect(response.body.data.type).toEqual('weeklyGoals');
    expect(response.body.data.caption).toEqual('I want to get Rp 5.000.000 this week');
    expect(response.body.data.photo).toEqual(['linkphoto1.com']);
    expect(response.body.data.shareWith).toEqual('private');
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should be able create one weekly goal (supporter)', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryResolutionId: data[0].categoryResolutionId.toString(),
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'supporter',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toEqual(data[0].categoryResolutionId.toString());
    expect(response.body.data.type).toEqual('weeklyGoals');
    expect(response.body.data.caption).toEqual('I want to get Rp 5.000.000 this week');
    expect(response.body.data.photo).toEqual(['linkphoto1.com']);
    expect(response.body.data.shareWith).toEqual('supporter');
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should thrown error if user id is not found', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryResolutionId: data[0].categoryResolutionId.toString(),
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if category resolution id is not found', async () => {
    const response = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryResolutionId: '12325320b7681b6c0b567bd5',
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: '12325320b7681b6c0b567bd5',
        categoryResolutionId: '12325320b7681b6c0b567bd5',
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
