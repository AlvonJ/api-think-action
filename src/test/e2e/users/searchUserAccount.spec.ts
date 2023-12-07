import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('search user account example', () => {
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

  it('should be able search user account', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get('/v1/users/search')
      .query({ username: 'user1' })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.results).toEqual(1);

    // expect response json
    expect(response.body.data[0]._id.toString()).toEqual(data[1]._id.toString());
    expect(response.body.data[0].username).toEqual(data[1].username);
    expect(response.body.data[0].fullname).toEqual(data[1].fullname);
    expect(response.body.data[0].photo).toEqual(data[1].photo);
    expect(response.body.data[0].supportedByCount).toEqual(1);
    expect(response.body.data[0].supportedBy).toBeDefined();
    expect(response.body.data[0].supportedBy[0]._id).toEqual(data[2]._id.toString());
    expect(response.body.data[0].supportedBy[0].username).toEqual(data[2].username);

    // after search, check if history account is inserted
    const response2 = await request(app).get('/v1/users/history').set('Authorization', `Bearer ${token}`);
    expect(response2.body.results).toEqual(1);
    expect(response2.body.data[0]._id).toEqual(data[1]._id.toString());
    expect(response2.body.data[0].fullname).toEqual(data[1].fullname.toString());
    expect(response2.body.data[0].username).toEqual(data[1].username.toString());
    expect(response2.body.data[0].photo).toEqual(data[1].photo.toString());
    expect(response2.body.data[0].supportedBy).toBeDefined();
    expect(response2.body.data[0].supportedBy[0]._id).toEqual(data[2]._id.toString());
    expect(response2.body.data[0].supportedBy[0].username).toEqual(data[2].username);
  });

  it('should thrown error if username search not found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get('/v1/users/search')
      .query({ username: 'test123' })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).get('/v1/users/search');

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
