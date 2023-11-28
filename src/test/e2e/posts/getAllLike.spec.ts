import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get all like from post example', () => {
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

  it('should be able get all like from post', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/${data[0]._id.toString()}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.likeCount).toBeDefined();

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].fullname).toEqual(user[0].fullname);
    expect(response.body.data[0].username).toEqual(user[0].username);
    expect(response.body.data[0].email).toEqual(user[0].email);
    expect(response.body.data[0].bio).toEqual(user[0].bio);
    expect(response.body.data[0].supportingCount).toEqual(user[0].supportingCount);
    expect(response.body.data[0].supporterCount).toEqual(user[0].supporterCount);
    expect(response.body.data[0].photo).toEqual(user[0].photo);
    expect(response.body.data[0].categoryResolution).toEqual(user[0].categoryResolution);
    expect(response.body.data[0].isPublic).toEqual(user[0].isPublic);

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].fullname).toEqual(user[1].fullname);
    expect(response.body.data[1].username).toEqual(user[1].username);
    expect(response.body.data[1].email).toEqual(user[1].email);
    expect(response.body.data[1].bio).toEqual(user[1].bio);
    expect(response.body.data[1].supportingCount).toEqual(user[1].supportingCount);
    expect(response.body.data[1].supporterCount).toEqual(user[1].supporterCount);
    expect(response.body.data[1].photo).toEqual(user[1].photo);
    expect(response.body.data[1].categoryResolution).toEqual(user[1].categoryResolution);
    expect(response.body.data[1].isPublic).toEqual(user[1].isPublic);
  });

  it('should be able to limit results', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/${data[0]._id.toString()}/like`)
      .query({ limit: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(1);
    expect(response.body.likeCount).toBeDefined();
  });

  it('should thrown error if post id is not found', async () => {
    const response = await request(app)
      .get(`/v1/posts/12325320b7681b6c0b567bd5/like`)
      .query({ limit: 1 })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get(`/v1/posts/12325320b7681b6c0b567bd5/like`);

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
