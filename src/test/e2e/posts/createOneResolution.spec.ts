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
    token = authResponse.body.token;
  });

  it('should be able create one resolution (everyone)', async () => {
    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Fitness',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toEqual(user[0].categoryResolution[1]._id.toString());
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual('I want to get Rp 30.000.000');
    expect(response.body.data.likeCount).toEqual(0);
    expect(response.body.data.commentCount).toEqual(0);
    expect(response.body.data.photo).toEqual(['linkphoto1.png']);
    expect(response.body.data.shareWith).toEqual('everyone');
    expect(response.body.data.isComplete).toEqual(false);
    expect(response.body.data.dueDate).toBeDefined();
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo._id).toEqual(user[0]._id.toString());
    expect(response.body.data.userInfo.username).toEqual(user[0].username);
    expect(response.body.data.userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data.userInfo.categoryResolution[0]._id).toEqual(user[0].categoryResolution[1]._id.toString());
    expect(response.body.data.userInfo.categoryResolution[0].name).toEqual(user[0].categoryResolution[1].name);
    expect(response.body.data.userInfo.categoryResolution[0].resolution).toEqual(
      user[0].categoryResolution[1].resolution
    );
    expect(response.body.data.userInfo.categoryResolution[0].isComplete).toEqual(
      user[0].categoryResolution[1].isComplete
    );
    expect(response.body.data.userInfo.categoryResolution[0].createdDate).toEqual(
      user[0].categoryResolution[1].createdDate
    );
  });

  it('should thrown error if user create same categoryName', async () => {
    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Fitness',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    const response2 = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Fitness',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    expect(response2.statusCode).toEqual(400);
    expect(response2.body.status).toEqual('error');
  });

  it('should thrown error if user with private account create resolution with public shareWith', async () => {
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
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user create more than 7 resolutions', async () => {
    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Fitness',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test1',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test2',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test3',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test4',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test5',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test6',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    const response = await request(app)
      .post(`/v1/posts/resolutions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryName: 'Test7',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app)
      .post('/v1/posts/resolutions')
      .send({
        categoryName: 'Fitness',
        caption: 'I want to get Rp 30.000.000',
        dueDate: '2024-11-26',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
      });

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
