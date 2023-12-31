import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('get current history account example', () => {
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

  it('should be able get current history account', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/v1/users/history').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.results).toBeDefined();

    // expect response json
    // data 1
    expect(response.body.data[0]._id.toString()).toEqual('657fb542e6af9505c74f537d');
    expect(response.body.data[0].username).toEqual('Test3');
    expect(response.body.data[0].fullname).toEqual(null);
    expect(response.body.data[0].photo).toEqual(null);
    expect(response.body.data[0].supportedByCount).toBeDefined();
    expect(response.body.data[0].supportedBy).toBeDefined();
    expect(response.body.data[0].password).toBeUndefined();
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).get('/v1/users/history');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
