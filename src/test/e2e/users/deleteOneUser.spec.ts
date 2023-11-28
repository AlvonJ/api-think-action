import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('delete one user example', () => {
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

  it('should be able delete one user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/v1/users/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});
  });

  it('should thrown error if user ID is not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/v1/users/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });
});
