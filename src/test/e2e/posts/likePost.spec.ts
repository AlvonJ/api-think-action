import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';
import { createFakeNotification } from '../../../infrastructure/database/mongodb/notifications/utils/createFakeNotification.js';
import { deleteAllNotifications } from '../../../infrastructure/database/mongodb/notifications/utils/deleteAllNotifications.js';

describe('like post example', () => {
  let app;
  let token;
  let user;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllPosts();
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllPosts();
  });

  beforeAll(async () => {
    app = createApp();

    user = await createFakeUser();
    await createFakeNotification();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[1].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be to like post', async () => {
    const data = await createFakePost();

    const response = await request(app).post(`/v1/posts/like`).set('Authorization', `Bearer ${token}`).send({
      postId: data[1]._id.toString(),
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toEqual(data[1]._id.toString());
    expect(response.body.data.likeCount).toEqual(1);

    // Check notification
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    const token2 = authResponse.body.token;

    const response2 = await request(app).get(`/v1/users/notification`).set('Authorization', `Bearer ${token2}`);
    expect(response2.statusCode).toEqual(200);
    expect(response2.body.notificationCount).toEqual(3);
    expect(response2.body.data.today[0]._id).toBeDefined();
    expect(response2.body.data.today[0].type).toEqual('message');
    expect(response2.body.data.today[0].message).toEqual(`${user[1].username} liked your post`);
  });

  it('should thrown error if post id is not found', async () => {
    const data = await createFakePost();

    const response = await request(app).post(`/v1/posts/like`).set('Authorization', `Bearer ${token}`).send({
      postId: '12325320b7681b6c0b567bd5',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).post(`/v1/posts/like`).send({
      postId: '12325320b7681b6c0b567bd5',
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
