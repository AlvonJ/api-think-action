import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('get one user example', () => {
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

  it('should be able to get current authenticated user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data._id.toString()).toEqual(data[0]._id.toString());
    expect(response.body.data.username).toEqual(data[0].username);
    expect(response.body.data.email).toEqual(data[0].email);
    expect(response.body.data.fullname).toEqual(data[0].fullname);
    expect(response.body.data.bio).toEqual(data[0].bio);
    expect(response.body.data.photo).toEqual(data[0].photo);
    expect(response.body.data.isPublic).toEqual(data[0].isPublic);
    expect(response.body.data.categoryResolution._id).toEqual(data[0].categoryResolution._id);
    expect(response.body.data.supporterCount).toEqual(2);
    expect(response.body.data.supportingCount).toEqual(2);
    expect(response.body.data.isAuthenticatedUser).toEqual(true);
    expect(response.body.data.password).toBeUndefined();
  });

  it('should be able to get another user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/${data[1]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data._id.toString()).toEqual(data[1]._id.toString());
    expect(response.body.data.username).toEqual(data[1].username);
    expect(response.body.data.email).toEqual(data[1].email);
    expect(response.body.data.fullname).toEqual(data[1].fullname);
    expect(response.body.data.bio).toEqual(data[1].bio);
    expect(response.body.data.photo).toEqual(data[1].photo);
    expect(response.body.data.isPublic).toEqual(data[1].isPublic);
    expect(response.body.data.categoryResolution._id).toEqual(data[1].categoryResolution._id);
    expect(response.body.data.supporterCount).toEqual(2);
    expect(response.body.data.supportingCount).toEqual(1);
    expect(response.body.data.isSupporting).toEqual(true);
    expect(response.body.data.isAuthenticatedUser).toEqual(false);
    expect(response.body.data.password).toBeUndefined();
  });

  it('should thrown error if user ID is not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const data = await createFakeUser();

    const response = await request(app).get(`/v1/users/${data[0]._id.toString()}`);

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
