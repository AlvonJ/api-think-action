import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeComment } from '../../../infrastructure/database/mongodb/comments/utils/createFakeComment.js';
import { deleteAllComments } from '../../../infrastructure/database/mongodb/comments/utils/deleteAllComments.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';

describe('get all comments example', () => {
  let app;
  let token;
  let post;
  let user;

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
    post = await createFakePost();

    user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be able get all comments', async () => {
    const data = await createFakeComment();

    const response = await request(app)
      .get(`/v1/comments/${post[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(2);
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].postId).toEqual(data[1].postId);
    expect(response.body.data[0].userId).toEqual(data[1].userId);
    expect(response.body.data[0].message).toEqual(data[1].message);
    expect(response.body.data[0].type).toEqual(data[1].type);
    expect(response.body.data[0].replyCount).toEqual(0);
    expect(response.body.data[0].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[0].userInfo).toBeDefined();
    expect(response.body.data[0].userInfo._id.toString()).toEqual(user[1]._id.toString());
    expect(response.body.data[0].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[1].photo);

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].postId).toEqual(data[0].postId);
    expect(response.body.data[1].userId).toEqual(data[0].userId);
    expect(response.body.data[1].message).toEqual(data[0].message);
    expect(response.body.data[1].type).toEqual(data[0].type);
    expect(response.body.data[1].replyCount).toEqual(1);
    expect(response.body.data[1].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[1].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[1].userInfo).toBeDefined();
    expect(response.body.data[1].userInfo._id.toString()).toEqual(user[0]._id.toString());
    expect(response.body.data[1].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[1].userInfo.photo).toEqual(user[0].photo);
  });

  it('should be able to limit results (page 1)', async () => {
    const data = await createFakeComment();

    const response = await request(app)
      .get(`/v1/comments/${post[0]._id.toString()}`)
      .query({ limit: 1, page: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].postId).toEqual(data[1].postId);
    expect(response.body.data[0].userId).toEqual(data[1].userId);
    expect(response.body.data[0].message).toEqual(data[1].message);
    expect(response.body.data[0].type).toEqual(data[1].type);
    expect(response.body.data[0].replyCount).toEqual(0);
    expect(response.body.data[0].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[0].userInfo).toBeDefined();
    expect(response.body.data[0].userInfo._id.toString()).toEqual(user[1]._id.toString());
    expect(response.body.data[0].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[1].photo);
  });

  it('should be able to limit results (page 2)', async () => {
    const data = await createFakeComment();

    const response = await request(app)
      .get(`/v1/comments/${post[0]._id.toString()}`)
      .query({ limit: 1, page: 2 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].postId).toEqual(data[0].postId);
    expect(response.body.data[0].userId).toEqual(data[0].userId);
    expect(response.body.data[0].message).toEqual(data[0].message);
    expect(response.body.data[0].type).toEqual(data[0].type);
    expect(response.body.data[0].replyCount).toEqual(1);
    expect(response.body.data[0].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[0].userInfo).toBeDefined();
    expect(response.body.data[0].userInfo._id.toString()).toEqual(user[0]._id.toString());
    expect(response.body.data[0].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[0].photo);
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get(`/v1/comments/${post[0]._id.toString()}`);

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
