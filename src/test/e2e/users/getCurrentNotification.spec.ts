import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllNotifications } from '../../../infrastructure/database/mongodb/notifications/utils/deleteAllNotifications.js';
import { createFakeNotification } from '../../../infrastructure/database/mongodb/notifications/utils/createFakeNotification.js';

describe('get current user notifications example', () => {
  let app;
  let notification;

  afterAll(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  beforeAll(async () => {
    app = createApp();

    notification = await createFakeNotification();
  });

  it('should be able get current user notification', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get(`/v1/users/notification`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(20);
    expect(response.body.notificationCount).toEqual(2);

    expect(response.body.data.today).toBeDefined();
    expect(response.body.data.today[0]._id).toEqual(notification[0]._id.toString());
    expect(response.body.data.today[0].type).toEqual(notification[0].type);
    expect(response.body.data.today[0].message).toEqual(notification[0].message);
    expect(response.body.data.today[0].status).toEqual(notification[0].status);
    expect(response.body.data.today[0].date).toEqual(notification[0].date);

    expect(response.body.data.yesterday).toBeDefined();
    expect(response.body.data.yesterday[0]._id).toEqual(notification[1]._id.toString());
    expect(response.body.data.yesterday[0].type).toEqual(notification[1].type);
    expect(response.body.data.yesterday[0].message).toEqual(notification[1].message);
    expect(response.body.data.yesterday[0].date).toEqual(notification[1].date);

    expect(response.body.data.thisWeek).toBeDefined();
    expect(response.body.data.thisMonth).toBeDefined();
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).get('/v1/users/notification');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
