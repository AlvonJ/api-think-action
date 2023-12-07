import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get one post example', () => {
  let app;
  let token;

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

    const user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be able get one post', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.userId).toEqual(data[0].userId);
    expect(response.body.data.categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data.type).toEqual(data[0].type);
    expect(response.body.data.caption).toEqual(data[0].caption);
    expect(response.body.data.dueDate).toEqual(data[0].dueDate);
    expect(response.body.data.createdDate).toEqual(data[0].createdDate);
    expect(response.body.data.updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data.shareWith).toEqual(data[0].shareWith);
    expect(response.body.data.userInfo).toBeDefined();
  });

  it('should thrown error if post is not found', async () => {
    const response = await request(app)
      .get(`/v1/posts/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts/12325320b7681b6c0b567bd5');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
