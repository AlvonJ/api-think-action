import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('login example', () => {
  let app;

  afterAll(async () => {
    await deleteAllUsers();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able to login user', async () => {
    const user = await createFakeUser();

    const response = await request(app).post('/v1/users/login').send({ email: user[0].email, password: '12345678' });

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.token).toBeDefined();

    // expect response json
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.fullname).toEqual(user[0].fullname);
    expect(response.body.data.user.username).toEqual(user[0].username);
    expect(response.body.data.user.email).toEqual(user[0].email);
    expect(response.body.data.user.bio).toEqual(user[0].bio);
    expect(response.body.data.user.supporterCount).toEqual(user[0].supporterCount);
    expect(response.body.data.user.supportingCount).toEqual(user[0].supportingCount);
    expect(response.body.data.user.photo).toEqual(user[0].photo);
    expect(response.body.data.user.categoryResolution._id).toEqual(user[0].categoryResolution._id);
    expect(response.body.data.user.isPublic).toEqual(user[0].isPublic);
    expect(response.body.data.user.password).toBeUndefined();
  });

  it('should thrown error if email/password is incorrect', async () => {
    const user = await createFakeUser();

    const response = await request(app).post('/v1/users/login').send({ email: user[0].email, password: '123456' });

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
