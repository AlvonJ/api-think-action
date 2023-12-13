import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('create one complete goal example', () => {
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

  it('should be able create one complete goal', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/completeGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: data[0].categoryResolutionId.toString(),
        weeklyGoalId: data[1]._id.toString(),
        caption: 'I already completed this weekly goal',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
        isComplete: false,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.categoryResolutionId).toEqual(data[0].categoryResolutionId.toString());
    expect(response.body.data.weeklyGoalId).toEqual(data[1]._id.toString());
    expect(response.body.data.type).toEqual('completeGoals');
    expect(response.body.data.caption).toEqual('I already completed this weekly goal');
    expect(response.body.data.photo).toEqual(['linkphoto1.png']);
    expect(response.body.data.likeCount).toEqual(0);
    expect(response.body.data.commentCount).toEqual(0);
    expect(response.body.data.shareWith).toEqual('everyone');
    expect(response.body.data.isComplete).toEqual(false);
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo.username).toEqual(user[0].username);
    expect(response.body.data.userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data.userInfo.categoryResolution[0]._id).toEqual(user[0].categoryResolution[0]._id.toString());
    expect(response.body.data.userInfo.categoryResolution[0].name).toEqual(user[0].categoryResolution[0].name);
    expect(response.body.data.userInfo.categoryResolution[0].resolution).toEqual(
      user[0].categoryResolution[0].resolution
    );
    expect(response.body.data.userInfo.categoryResolution[0].isComplete).toEqual(
      user[0].categoryResolution[0].isComplete
    );
    expect(response.body.data.userInfo.categoryResolution[0].createdDate).toEqual(
      user[0].categoryResolution[0].createdDate
    );

    // Check if weeklyGoal is updated
    const response2 = await request(app)
      .get(`/v1/posts/${data[1]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response2.body.data.isComplete).toEqual(true);
  });

  it('should thrown error if user with private account create complete goal with public shareWith', async () => {
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
        shareWith: 'private',
        photo: ['linkphoto1.png'],
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    const response2 = await request(app)
      .post(`/v1/posts/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: response.body.data.categoryResolutionId.toString(),
        caption: 'I want to get Rp 5.000.000 this week',
        dueDate: '2023-11-30',
        shareWith: 'private',
        photo: ['linkphoto1.png'],
      });

    expect(response2.statusCode).toEqual(200);
    expect(response2.body.status).toEqual('success');

    const response3 = await request(app)
      .post(`/v1/posts/completeGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: response.body.data.categoryResolutionId.toString(),
        weeklyGoalId: response2.body.data._id.toString(),
        caption: 'I already completed this weekly goal',
        shareWith: 'everyone',
        photo: ['linkphoto1.png'],
        isComplete: false,
      });

    expect(response3.statusCode).toEqual(400);
    expect(response3.body.status).toEqual('error');
  });

  it('should thrown error if category resolution id is not found', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/completeGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: '12325320b7681b6c0b567bd5',
        weeklyGoalId: data[1]._id.toString(),
        caption: 'I already completed this weekly goal',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
        isComplete: false,
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if weekly goal id is not found', async () => {
    const data = createFakePost();

    const response = await request(app)
      .post(`/v1/posts/completeGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoryResolutionId: data[0].categoryResolutionId.toString(),
        weeklyGoalId: '12325320b7681b6c0b567bd5',
        caption: 'I already completed this weekly goal',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
        isComplete: false,
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app)
      .post(`/v1/posts/completeGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: '12325320b7681b6c0b567bd5',
        categoryResolutionId: '12325320b7681b6c0b567bd5',
        weeklyGoalId: '12325320b7681b6c0b567bd5',
        caption: 'I already completed this weekly goal',
        shareWith: 'everyone',
        photo: ['linkphoto1.com'],
        isComplete: false,
      });

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
