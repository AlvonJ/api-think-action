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

  it('should be able to update user profile', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/v1/users/${data[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullname: 'Updated Fullname',
        username: 'username',
        bio: 'test bio',
        photo: 'linkphoto.com',
        isPublic: false,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data.fullname).not.toEqual(data[0].fullname);
    expect(response.body.data.username).not.toEqual(data[0].username);
    expect(response.body.data.bio).not.toEqual(data[0].bio);
    expect(response.body.data.photo).not.toEqual(data[0].photo);
    expect(response.body.data.isPublic).not.toEqual(data[0].isPublic);
  });

  it('should thrown error if user ID is not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/v1/users/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullname: 'Updated Fullname',
        username: 'username',
        bio: 'test bio',
        photo: 'linkphoto.com',
        isPublic: false,
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).patch(`/v1/users/12325320b7681b6c0b567bd5`);

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
