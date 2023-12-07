import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllNotifications } from '../../../infrastructure/database/mongodb/notifications/utils/deleteAllNotifications.js';
import { createFakeNotification } from '../../../infrastructure/database/mongodb/notifications/utils/createFakeNotification.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('delete one notification example', () => {
  let app;
  let token;

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

  it('should be able to delete one notification', async () => {
    const data = await createFakeNotification();

    const response = await request(app)
      .delete(`/v1/notifications/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(204);
    expect(response.body).toStrictEqual({});
  });

  it('should thrown error if notification is not found', async () => {
    const response = await request(app)
      .delete(`/v1/notifications/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).delete('/v1/notifications/12325320b7681b6c0b567bd5');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
