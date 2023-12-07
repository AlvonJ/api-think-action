import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('support another user account example', () => {
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

  it('should be able to support another public user account', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .post('/v1/users/support')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: data[3]._id.toString() });

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('User is now supported');

    // expect response json
    expect(response.body.data._id.toString()).toEqual(data[3]._id.toString());
    expect(response.body.data.supporterCount).toEqual(1);
  });

  it('should be able to send request support to private user account', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[3].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .post('/v1/users/support')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: data[1]._id.toString() });

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Support request sent successfully');

    // expect response json
    expect(response.body.data._id.toString()).toEqual(data[1]._id.toString());
  });

  it('should thrown error if userId is not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .post('/v1/users/support')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: '12325320b7681b6c0b567bd5' });

    // expect http response
    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).post('/v1/users/support');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
