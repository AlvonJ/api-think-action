import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('unlike post example', () => {
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

  it('should be to unlike post', async () => {
    const data = await createFakePost();

    const response = await request(app).post(`/v1/posts/unlike`).set('Authorization', `Bearer ${token}`).send({
      postId: data[0]._id.toString(),
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toEqual(data[0]._id.toString());
    expect(response.body.data.likeCount).toEqual(3);
  });

  it('should thrown error if post id is not found', async () => {
    const data = await createFakePost();

    const response = await request(app).post(`/v1/posts/unlike`).set('Authorization', `Bearer ${token}`).send({
      postId: '12325320b7681b6c0b567bd5',
    });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).post(`/v1/posts/unlike`).send({
      postId: '12325320b7681b6c0b567bd5',
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
