import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllNotifications } from '../../../infrastructure/database/mongodb/notifications/utils/deleteAllNotifications.js';
import { createFakeNotification } from '../../../infrastructure/database/mongodb/notifications/utils/createFakeNotification.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('get all notifications example', () => {
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

  it('should be able get all notification', async () => {
    const data = await createFakeNotification();

    const response = await request(app).get(`/v1/notifications`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toBeDefined();

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].type).toEqual(data[0].type);
    expect(response.body.data[0].message).toEqual(data[0].message);
    expect(response.body.data[0].date).toEqual(data[0].date);

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].type).toEqual(data[1].type);
    expect(response.body.data[1].message).toEqual(data[1].message);
    expect(response.body.data[1].date).toEqual(data[1].date);
    expect(response.body.data[1].status).toEqual(data[1].status);
  });

  it('should be able to limit results', async () => {
    await createFakeNotification();

    const response = await request(app)
      .get('/v1/notifications')
      .query({ limit: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/notifications');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
