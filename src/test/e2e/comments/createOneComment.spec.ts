import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllComments } from '../../../infrastructure/database/mongodb/comments/utils/deleteAllComments.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';

describe('create one comment example', () => {
  let app;
  let token;
  let user;
  let post;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllComments();
    await deleteAllUsers();
    await deleteAllPosts();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllComments();
  });

  beforeAll(async () => {
    app = createApp();

    user = await createFakeUser();
    post = await createFakePost();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be able create one comment', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      postId: post[0]._id.toString(),
      message: 'This is new comment!',
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.postId).toEqual(post[0]._id.toString());
    expect(response.body.data.message).toEqual('This is new comment!');
    expect(response.body.data.type).toEqual('comment');
    expect(response.body.data.replyCount).toEqual(0);
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo._id.toString()).toEqual(user[0]._id.toString());
    expect(response.body.data.userInfo.username).toEqual(user[0].username);
    expect(response.body.data.userInfo.photo).toEqual(user[0].photo);
  });

  it('should be able create one comment and get notification', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      postId: post[2]._id.toString(),
      message: 'This is new comment!',
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(user[0]._id.toString());
    expect(response.body.data.postId).toEqual(post[2]._id.toString());
    expect(response.body.data.message).toEqual('This is new comment!');
    expect(response.body.data.type).toEqual('comment');
    expect(response.body.data.replyCount).toEqual(0);
    expect(response.body.data.createdDate).toBeDefined();
    expect(response.body.data.updatedDate).toBeNull();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo._id.toString()).toEqual(user[0]._id.toString());
    expect(response.body.data.userInfo.username).toEqual(user[0].username);
    expect(response.body.data.userInfo.photo).toEqual(user[0].photo);

    // Check notification
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[1].email, password: '12345678' });
    const token2 = authResponse.body.token;

    const response2 = await request(app).get(`/v1/users/notification`).set('Authorization', `Bearer ${token2}`);
    expect(response2.statusCode).toEqual(200);
    expect(response2.body.notificationCount).toEqual(2);
    expect(response2.body.data.today[0]._id).toBeDefined();
    expect(response2.body.data.today[0].type).toEqual('message');
    expect(response2.body.data.today[0].message).toEqual(`${user[0].username} commented on your post`);
  });

  it('should thrown error if post id is not found', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      postId: '12325320b7681b6c0b567bd5',
      message: 'This is new comment!',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown validation error if message is empty or null', async () => {
    const response = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      postId: '12325320b7681b6c0b567bd5',
      message: '',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toEqual('error');

    const response2 = await request(app).post(`/v1/comments`).set('Authorization', `Bearer ${token}`).send({
      postId: '12325320b7681b6c0b567bd5',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).post('/v1/comments');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
