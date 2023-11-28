import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('create one category resolution for user example', () => {
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

  it('should be able create category resolution for user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .post(`/v1/users/${data[0]._id.toString()}/categoryResolution`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Name Category Resolution',
        resolution: 'Resolution for Category Resolution',
      });

    // expect http response
    expect(response.statusCode).toEqual(201);

    // expect response json
    expect(response.body.data._id.toString()).toEqual(data[0]._id.toString());
    expect(response.body.data.categoryResolution.length).toEqual(data[0].categoryResolution.length + 1);
  });

  it('should thrown error if user ID is not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .post(`/v1/users/12325320b7681b6c0b567bd5/categoryResolution`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Name Category Resolution',
        resolution: 'Resolution for Category Resolution',
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).post(`/v1/users/12325320b7681b6c0b567bd5/categoryResolution`).send({
      name: 'Name Category Resolution',
      resolution: 'Resolution for Category Resolution',
    });

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
