import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllNotifications } from '../../../infrastructure/database/mongodb/notifications/utils/deleteAllNotifications.js';
import { createFakeNotification } from '../../../infrastructure/database/mongodb/notifications/utils/createFakeNotification.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('get one notification example', () => {
  let app;
  let token;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllNotifications();
  });

  beforeAll(async () => {
    app = createApp();

    const user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be able get one notification', async () => {
    const data = await createFakeNotification();

    const response = await request(app)
      .get(`/v1/notifications/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.type).toEqual(data[0].type);
    expect(response.body.data.message).toEqual(data[0].message);
    expect(response.body.data.date).toEqual(data[0].date);
  });

  it('should thrown error if notification is not found', async () => {
    const response = await request(app)
      .get(`/v1/notifications/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/notifications/12325320b7681b6c0b567bd5');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
