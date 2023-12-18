import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('update current user password example', () => {
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

  it('should be able to update current user password', async () => {
    const user = await createFakeUser();

    const loginResponse = await request(app)
      .post('/v1/users/login')
      .send({ email: user[0].email, password: '12345678' });
    const { token } = loginResponse.body;

    const response = await request(app)
      .patch('/v1/users/updateMyPassword')
      .send({
        passwordCurrent: '12345678',
        passwordNew: '123456',
      })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.token).toBeDefined();
  });

  it('should thrown error if current password is wrong', async () => {
    const user = await createFakeUser();

    const loginResponse = await request(app)
      .post('/v1/users/login')
      .send({ email: user[0].email, password: '12345678' });
    const { token } = loginResponse.body;

    const response = await request(app)
      .patch('/v1/users/updateMyPassword')
      .send({
        passwordCurrent: '12345678910',
        passwordNew: '123456',
      })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
