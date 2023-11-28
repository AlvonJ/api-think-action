import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('update one category resolution for user example', () => {
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

  it('should be able to update one category resolution for user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/v1/users/${data[0]._id.toString()}/categoryResolution/${data[0].categoryResolution[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        resolution: 'Updated Resolution',
        isComplete: true,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.categoryResolution[0]._id).toEqual(data[0].categoryResolution[0]._id);
    expect(response.body.data.categoryResolution[0].name).not.toEqual(data[0].categoryResolution[0].name);
    expect(response.body.data.categoryResolution[0].resolution).not.toEqual(data[0].categoryResolution[0].resolution);
    expect(response.body.data.categoryResolution[0].isComplete).not.toEqual(data[0].categoryResolution[0].isComplete);
  });

  it('should thrown error if user ID is not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/v1/users/12325320b7681b6c0b567bd5/categoryResolution/${data[0].categoryResolution[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        resolution: 'Updated Resolution',
        isComplete: true,
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).patch(
      `/v1/users/12325320b7681b6c0b567bd5/categoryResolution/12325320b7681b6c0b567bd5`
    );

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
