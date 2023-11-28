import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';

describe('update one weekly goal example', () => {
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
    token = authResponse.body;
  });

  it('should be able to update one weekly goal', async () => {
    const data = createFakePost();

    const response = await request(app)
      .patch(`/v1/posts/${data[1]._id.toString()}/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        caption: 'Updated Caption',
        shareWith: 'private',
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');

    expect(response.body.data._id.toString()).toBeDefined();
    expect(response.body.data.caption).not.toEqual(data[1].caption);
    expect(response.body.data.shareWith).not.toEqual(data[1].shareWith);
    expect(response.body.data.updatedDate).not.toBeNull();
  });

  it('should thrown error if weekly goal id is not found', async () => {
    const response = await request(app)
      .patch(`/v1/posts/12325320b7681b6c0b567bd5/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        caption: 'Updated Caption',
        shareWith: 'private',
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app)
      .patch(`/v1/posts/12325320b7681b6c0b567bd5/weeklyGoals`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
