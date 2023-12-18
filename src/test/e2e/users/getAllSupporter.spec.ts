import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('get all supporters example', () => {
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

  it('should be able get all supporter', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/${data[0]._id.toString()}/supporter`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(2);
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toEqual(data[1]._id.toString());
    expect(response.body.data[0].fullname).toEqual(data[1].fullname);
    expect(response.body.data[0].email).toEqual(data[1].email);
    expect(response.body.data[0].username).toEqual(data[1].username);
    expect(response.body.data[0].bio).toEqual(data[1].bio);
    expect(response.body.data[0].supporterCount).toEqual(data[1].supporterCount);
    expect(response.body.data[0].supportingCount).toEqual(data[1].supportingCount);
    expect(response.body.data[0].photo).toEqual(data[1].photo);
    expect(response.body.data[0].categoryResolution._id).toEqual(data[1].categoryResolution._id);
    expect(response.body.data[0].isPublic).toEqual(data[1].isPublic);
    expect(response.body.data[0].isSupporting).toEqual(true);

    expect(response.body.data[1]._id.toString()).toEqual(data[2]._id.toString());
    expect(response.body.data[1].fullname).toEqual(data[2].fullname);
    expect(response.body.data[1].email).toEqual(data[2].email);
    expect(response.body.data[1].username).toEqual(data[2].username);
    expect(response.body.data[1].bio).toEqual(data[2].bio);
    expect(response.body.data[1].supporterCount).toEqual(data[2].supporterCount);
    expect(response.body.data[1].supportingCount).toEqual(data[2].supportingCount);
    expect(response.body.data[1].photo).toEqual(data[2].photo);
    expect(response.body.data[1].categoryResolution._id).toEqual(data[2].categoryResolution._id);
    expect(response.body.data[1].isPublic).toEqual(data[2].isPublic);
    expect(response.body.data[1].isSupporting).toEqual(true);
  });

  it('should be able to limit results (page 1)', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/${data[0]._id.toString()}/supporter`)
      .query({ limit: 1, page: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toEqual(data[1]._id.toString());
    expect(response.body.data[0].fullname).toEqual(data[1].fullname);
    expect(response.body.data[0].email).toEqual(data[1].email);
    expect(response.body.data[0].username).toEqual(data[1].username);
    expect(response.body.data[0].bio).toEqual(data[1].bio);
    expect(response.body.data[0].supporterCount).toEqual(data[1].supporterCount);
    expect(response.body.data[0].supportingCount).toEqual(data[1].supportingCount);
    expect(response.body.data[0].photo).toEqual(data[1].photo);
    expect(response.body.data[0].categoryResolution._id).toEqual(data[1].categoryResolution._id);
    expect(response.body.data[0].isPublic).toEqual(data[1].isPublic);
    expect(response.body.data[0].isSupporting).toEqual(true);
  });

  it('should be able to limit results (page 2)', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/v1/users/${data[0]._id.toString()}/supporter`)
      .query({ limit: 1, page: 2 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(2);

    expect(response.body.data[0]._id.toString()).toEqual(data[2]._id.toString());
    expect(response.body.data[0].fullname).toEqual(data[2].fullname);
    expect(response.body.data[0].email).toEqual(data[2].email);
    expect(response.body.data[0].username).toEqual(data[2].username);
    expect(response.body.data[0].bio).toEqual(data[2].bio);
    expect(response.body.data[0].supporterCount).toEqual(data[2].supporterCount);
    expect(response.body.data[0].supportingCount).toEqual(data[2].supportingCount);
    expect(response.body.data[0].photo).toEqual(data[2].photo);
    expect(response.body.data[0].categoryResolution._id).toEqual(data[2].categoryResolution._id);
    expect(response.body.data[0].isPublic).toEqual(data[2].isPublic);
    expect(response.body.data[0].isSupporting).toEqual(true);
  });

  it('should thrown Authentication Error if user is not logged in', async () => {
    const response = await request(app).get(`/v1/users/supporter`);

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
