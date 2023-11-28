import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('update supporter example', () => {
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

  it('should be able to add supporter', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/v1/users/${data[0]._id.toString()}/supporter`)
      .set('Authorization', `Bearer ${token}`)
      .send({ supporter: '655b1aa6d8acd1e420d13445' });

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Supporter list updated successfully');
    expect(response.body.status).toEqual('success');
    expect(response.body.data.supporterCount).toEqual(data[0].supporterCount + 1);
    expect(response.body.data.supportingCount).toBeDefined();
  });

  it('should be able to remove supporter', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/v1/users/${data[0]._id.toString()}/supporter`)
      .set('Authorization', `Bearer ${token}`)
      .send({ supporter: data[0].supporter[0] });

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Supporter list updated successfully');
    expect(response.body.status).toEqual('success');
    expect(response.body.data.supporterCount).toEqual(data[0].supporterCount - 1);
    expect(response.body.data.supportingCount).toBeDefined();
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).patch('/v1/users/12325320b7681b6c0b567bd5/supporter');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
