import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get all like from post example', () => {
  let app;
  let token;
  let user;

  afterAll(async () => {
    jest.setTimeout(20000);
    await deleteAllPosts();
    await deleteAllUsers();
  });

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllPosts();
  });

  beforeAll(async () => {
    app = createApp();

    user = await createFakeUser();
    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[0].email, password: '12345678' });
    token = authResponse.body.token;
  });

  it('should be able get all like from post', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/${data[0]._id.toString()}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.likeCount).toEqual(4);
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toEqual(user[0]._id.toString());
    expect(response.body.data[0].fullname).toEqual(user[0].fullname);
    expect(response.body.data[0].username).toEqual(user[0].username);
    expect(response.body.data[0].email).toEqual(user[0].email);
    expect(response.body.data[0].bio).toEqual(user[0].bio);
    expect(response.body.data[0].supportingCount).toEqual(2);
    expect(response.body.data[0].supporterCount).toEqual(2);
    expect(response.body.data[0].photo).toEqual(user[0].photo);
    expect(response.body.data[0].categoryResolution).toEqual(user[0].categoryResolution);
    expect(response.body.data[0].isPublic).toEqual(user[0].isPublic);
    expect(response.body.data[0].isAuthenticatedUser).toEqual(true);

    expect(response.body.data[1]._id.toString()).toEqual(user[1]._id.toString());
    expect(response.body.data[1].fullname).toEqual(user[1].fullname);
    expect(response.body.data[1].username).toEqual(user[1].username);
    expect(response.body.data[1].email).toEqual(user[1].email);
    expect(response.body.data[1].bio).toEqual(user[1].bio);
    expect(response.body.data[1].supportingCount).toEqual(1);
    expect(response.body.data[1].supporterCount).toEqual(2);
    expect(response.body.data[1].photo).toEqual(user[1].photo);
    expect(response.body.data[1].categoryResolution).toEqual(user[1].categoryResolution);
    expect(response.body.data[1].isPublic).toEqual(user[1].isPublic);
    expect(response.body.data[1].isSupporting).toEqual(true);

    expect(response.body.data[2]._id.toString()).toEqual(user[2]._id.toString());
    expect(response.body.data[2].fullname).toEqual(user[2].fullname);
    expect(response.body.data[2].username).toEqual(user[2].username);
    expect(response.body.data[2].email).toEqual(user[2].email);
    expect(response.body.data[2].bio).toEqual(user[2].bio);
    expect(response.body.data[2].supportingCount).toEqual(2);
    expect(response.body.data[2].supporterCount).toEqual(1);
    expect(response.body.data[2].photo).toEqual(user[2].photo);
    expect(response.body.data[2].categoryResolution).toEqual(user[2].categoryResolution);
    expect(response.body.data[2].isPublic).toEqual(user[2].isPublic);
    expect(response.body.data[2].isSupporting).toEqual(true);

    expect(response.body.data[3]._id.toString()).toEqual(user[3]._id.toString());
    expect(response.body.data[3].fullname).toEqual(user[3].fullname);
    expect(response.body.data[3].username).toEqual(user[3].username);
    expect(response.body.data[3].email).toEqual(user[3].email);
    expect(response.body.data[3].bio).toEqual(user[3].bio);
    expect(response.body.data[3].supportingCount).toEqual(0);
    expect(response.body.data[3].supporterCount).toEqual(0);
    expect(response.body.data[3].photo).toEqual(user[3].photo);
    expect(response.body.data[3].categoryResolution).toEqual(user[3].categoryResolution);
    expect(response.body.data[3].isPublic).toEqual(user[3].isPublic);
    expect(response.body.data[3].isSupporting).toEqual(false);
  });

  it('should be able to limit results (page 1)', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/${data[0]._id.toString()}/like`)
      .query({ limit: 1, page: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(1);
    expect(response.body.likeCount).toEqual(4);
    expect(response.body.data.length).toEqual(1);

    expect(response.body.data[0]._id.toString()).toEqual(user[0]._id.toString());
    expect(response.body.data[0].fullname).toEqual(user[0].fullname);
    expect(response.body.data[0].username).toEqual(user[0].username);
    expect(response.body.data[0].email).toEqual(user[0].email);
    expect(response.body.data[0].bio).toEqual(user[0].bio);
    expect(response.body.data[0].supportingCount).toEqual(2);
    expect(response.body.data[0].supporterCount).toEqual(2);
    expect(response.body.data[0].photo).toEqual(user[0].photo);
    expect(response.body.data[0].categoryResolution).toEqual(user[0].categoryResolution);
    expect(response.body.data[0].isPublic).toEqual(user[0].isPublic);
    expect(response.body.data[0].isAuthenticatedUser).toEqual(true);
  });

  it('should be able to limit results (page 2)', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts/${data[0]._id.toString()}/like`)
      .query({ limit: 1, page: 2 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(2);
    expect(response.body.likeCount).toEqual(4);
    expect(response.body.data.length).toEqual(1);

    expect(response.body.data[0]._id.toString()).toEqual(user[1]._id.toString());
    expect(response.body.data[0].fullname).toEqual(user[1].fullname);
    expect(response.body.data[0].username).toEqual(user[1].username);
    expect(response.body.data[0].email).toEqual(user[1].email);
    expect(response.body.data[0].bio).toEqual(user[1].bio);
    expect(response.body.data[0].supportingCount).toEqual(1);
    expect(response.body.data[0].supporterCount).toEqual(2);
    expect(response.body.data[0].photo).toEqual(user[1].photo);
    expect(response.body.data[0].categoryResolution).toEqual(user[1].categoryResolution);
    expect(response.body.data[0].isPublic).toEqual(user[1].isPublic);
    expect(response.body.data[0].isAuthenticatedUser).toEqual(false);
    expect(response.body.data[0].isSupporting).toEqual(true);
  });

  it('should thrown error if post id is not found', async () => {
    const response = await request(app)
      .get(`/v1/posts/12325320b7681b6c0b567bd5/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get(`/v1/posts/12325320b7681b6c0b567bd5/like`);

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
