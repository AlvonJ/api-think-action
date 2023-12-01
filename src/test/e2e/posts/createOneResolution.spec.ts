import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';

describe('create one resolution example', () => {
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

  it('should be able create one resolution (everyone)', async () => {
    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryName: 'Finance',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual('I want to get Rp 30.000.000');
    expect(response.body.data.photo).toEqual(['linkphoto1.com']);
    expect(response.body.data.shareWith).toEqual('everyone');
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should be able create one resolution (private)', async () => {
    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryName: 'Finance',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'private',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual('I want to get Rp 30.000.000');
    expect(response.body.data.photo).toEqual(['linkphoto1.com']);
    expect(response.body.data.shareWith).toEqual('private');
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should be able create one resolution (supporter)', async () => {
    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user[0]._id.toString(),
        categoryName: 'Finance',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'supporter',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual('I want to get Rp 30.000.000');
    expect(response.body.data.photo).toEqual(['linkphoto1.com']);
    expect(response.body.data.shareWith).toEqual('supporter');
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should thrown error if user id is not found', async () => {
    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: '12325320b7681b6c0b567bd5',
        categoryName: 'Finance',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app)
      .post('/v1/posts/resolutions')
      .send({
        userId: '12325320b7681b6c0b567bd5',
        categoryName: 'Finance',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
      });

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
