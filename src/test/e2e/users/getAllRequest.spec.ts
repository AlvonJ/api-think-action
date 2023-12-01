import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('get all request example', () => {
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

  it('should be able get all request', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/${data[0]._id.toString()}/request`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.supporterCount).toBeDefined();

    expect(response.body.data[0]._id.toString()).toEqual(data[1]._id.toString());
    expect(response.body.data[0].fullname).toEqual(data[1].fullname);
    expect(response.body.data[0].email).toEqual(data[1].email);
    expect(response.body.data[0].username).toEqual(data[1].username);
    expect(response.body.data[0].bio).toEqual(data[1].bio);
    expect(response.body.data[0].supporterCount).toEqual(data[1].supporterCount);
    expect(response.body.data[0].supportingCount).toEqual(data[1].supportingCount);
    expect(response.body.data[0].photo).toEqual(data[1].photo);
    expect(response.body.data[0].isPublic).toEqual(data[1].isPublic);
    expect(response.body.data[0].categoryResolution).toEqual(data[1].categoryResolution);
    expect(response.body.data[0].password).toBeUndefined();
  });

  it('should be able to limit results', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get('/v1/users/request')
      .query({ limit: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).get('/v1/users/request');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});