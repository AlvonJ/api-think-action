import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('delete current history account example', () => {
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

  it('should be able delete current history account', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).delete('/v1/users/history').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(201);
    expect(response.body).toStrictEqual({});

    // check if history account is deleted
    const response2 = await request(app).get(`/v1/users/history`).set('Authorization', `Bearer ${token}`);
    expect(response2.body.results).toEqual(0);
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).delete('/v1/users/history');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
