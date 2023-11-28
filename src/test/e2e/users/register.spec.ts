import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('create register example', () => {
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

  it('should be able to register user', async () => {
    const user = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
    };

    const response = await request(app).post('/v1/users/register').send(user);

    // expect http response
    expect(response.statusCode).toEqual(201);

    // expect response json
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.username).toEqual(user.username);
    expect(response.body.data.user.email).toEqual(user.email);
    expect(response.body.data.user.password).toBeUndefined();
  });
});
