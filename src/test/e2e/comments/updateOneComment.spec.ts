import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllComments } from '../../../infrastructure/database/mongodb/comments/utils/deleteAllComments.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';
import { createFakeComment } from '../../../infrastructure/database/mongodb/comments/utils/createFakeComment.js';

describe('update one comment example', () => {
  let app;
  let token;
  let user;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllComments();
    await deleteAllUsers();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllComments();
  });

  beforeAll(async () => {
    app = createApp();

    user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body;
  });

  it('should be able to update one comment', async () => {
    const data = createFakeComment();

    const response = await request(app)
      .patch(`/v1/comments/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'This is new comment updated!',
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(data[0].userId);
    expect(response.body.data.postId).toEqual(data[0].postId);
    expect(response.body.data.message).not.toEqual(data[0].message);
    expect(response.body.data.replyCount).toEqual(data[0].replyCount);
    expect(response.body.data.createdDate).toEqual(data[0].createdDate);
    expect(response.body.data.updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should thrown error if comment id is not found', async () => {
    const response = await request(app)
      .patch(`/v1/comments/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'This is new comment updated!',
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).patch('/v1/comments/12325320b7681b6c0b567bd5');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
