import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllPosts } from '../../../infrastructure/database/mongodb/posts/utils/deleteAllPosts.js';
import { createFakePost } from '../../../infrastructure/database/mongodb/posts/utils/createFakePost.js';

describe('get all posts example', () => {
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

  it('should be able get all posts (user 0)', async () => {
    const data = await createFakePost();

    const response = await request(app).get(`/v1/posts`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);
    expect(response.body.results).toEqual(3);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[2].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[2].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[2].type);
    expect(response.body.data[0].caption).toEqual(data[2].caption);
    expect(response.body.data[0].photo).toEqual(data[2].photo);
    expect(response.body.data[0].dueDate).toEqual(data[2].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[2].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[2].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[2].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[2].isComplete);
    expect(response.body.data[0].likeCount).toEqual(1);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[1]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[1].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[2].categoryResolutionId);

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].userId).toEqual(data[1].userId);
    expect(response.body.data[1].categoryResolutionId).toEqual(data[1].categoryResolutionId);
    expect(response.body.data[1].type).toEqual(data[1].type);
    expect(response.body.data[1].caption).toEqual(data[1].caption);
    expect(response.body.data[1].photo).toEqual(data[1].photo);
    expect(response.body.data[1].dueDate).toEqual(data[1].dueDate);
    expect(response.body.data[1].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[1].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[1].shareWith).toEqual(data[1].shareWith);
    expect(response.body.data[1].isComplete).toEqual(data[1].isComplete);
    expect(response.body.data[1].likeCount).toEqual(0);
    expect(response.body.data[1].commentCount).toEqual(0);
    expect(response.body.data[1].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[1].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[1].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[1].userInfo.categoryResolution._id).toEqual(data[1].categoryResolutionId);

    expect(response.body.data[2]._id.toString()).toBeDefined();
    expect(response.body.data[2].userId).toEqual(data[0].userId);
    expect(response.body.data[2].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[2].type).toEqual(data[0].type);
    expect(response.body.data[2].caption).toEqual(data[0].caption);
    expect(response.body.data[2].photo).toEqual(data[0].photo);
    expect(response.body.data[2].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[2].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[2].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[2].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[2].isComplete).toEqual(data[0].isComplete);
    expect(response.body.data[2].likeCount).toEqual(4);
    expect(response.body.data[2].commentCount).toEqual(0);
    expect(response.body.data[2].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[2].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[2].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[2].userInfo.categoryResolution._id).toEqual(data[0].categoryResolutionId);
  });

  it('should be able get all posts (user 1)', async () => {
    const data = await createFakePost();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[1].email, password: '12345678' });
    const token = authResponse.body.token;

    const response = await request(app).get(`/v1/posts`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);
    expect(response.body.results).toEqual(4);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[3].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[3].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[3].type);
    expect(response.body.data[0].caption).toEqual(data[3].caption);
    expect(response.body.data[0].photo).toEqual(data[3].photo);
    expect(response.body.data[0].dueDate).toEqual(data[3].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[3].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[3].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[3].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[3].isComplete);
    expect(response.body.data[0].likeCount).toEqual(0);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[1]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[1].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[3].categoryResolutionId);

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].userId).toEqual(data[2].userId);
    expect(response.body.data[1].categoryResolutionId).toEqual(data[2].categoryResolutionId);
    expect(response.body.data[1].type).toEqual(data[2].type);
    expect(response.body.data[1].caption).toEqual(data[2].caption);
    expect(response.body.data[1].photo).toEqual(data[2].photo);
    expect(response.body.data[1].dueDate).toEqual(data[2].dueDate);
    expect(response.body.data[1].createdDate).toEqual(data[2].createdDate);
    expect(response.body.data[1].updatedDate).toEqual(data[2].updatedDate);
    expect(response.body.data[1].shareWith).toEqual(data[2].shareWith);
    expect(response.body.data[1].isComplete).toEqual(data[2].isComplete);
    expect(response.body.data[1].likeCount).toEqual(1);
    expect(response.body.data[1].commentCount).toEqual(0);
    expect(response.body.data[1].userInfo._id).toEqual(user[1]._id);
    expect(response.body.data[1].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[1].userInfo.photo).toEqual(user[1].photo);
    expect(response.body.data[1].userInfo.categoryResolution._id).toEqual(data[2].categoryResolutionId);

    expect(response.body.data[2]._id.toString()).toBeDefined();
    expect(response.body.data[2].userId).toEqual(data[1].userId);
    expect(response.body.data[2].categoryResolutionId).toEqual(data[1].categoryResolutionId);
    expect(response.body.data[2].type).toEqual(data[1].type);
    expect(response.body.data[2].caption).toEqual(data[1].caption);
    expect(response.body.data[2].photo).toEqual(data[1].photo);
    expect(response.body.data[2].dueDate).toEqual(data[1].dueDate);
    expect(response.body.data[2].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[2].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[2].shareWith).toEqual(data[1].shareWith);
    expect(response.body.data[2].isComplete).toEqual(data[1].isComplete);
    expect(response.body.data[2].likeCount).toEqual(0);
    expect(response.body.data[2].commentCount).toEqual(0);
    expect(response.body.data[2].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[2].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[2].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[2].userInfo.categoryResolution._id).toEqual(data[1].categoryResolutionId);

    expect(response.body.data[3]._id.toString()).toBeDefined();
    expect(response.body.data[3].userId).toEqual(data[0].userId);
    expect(response.body.data[3].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[3].type).toEqual(data[0].type);
    expect(response.body.data[3].caption).toEqual(data[0].caption);
    expect(response.body.data[3].photo).toEqual(data[0].photo);
    expect(response.body.data[3].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[3].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[3].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[3].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[3].isComplete).toEqual(data[0].isComplete);
    expect(response.body.data[3].likeCount).toEqual(0);
    expect(response.body.data[3].commentCount).toEqual(0);
    expect(response.body.data[3].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[3].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[3].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[3].userInfo.categoryResolution._id).toEqual(data[0].categoryResolutionId);
  });

  it('should be able get all posts (user 2)', async () => {
    const data = await createFakePost();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[2].email, password: '12345678' });
    const token = authResponse.body.token;

    const response = await request(app).get(`/v1/posts`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);
    expect(response.body.results).toEqual(3);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[2].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[2].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[2].type);
    expect(response.body.data[0].caption).toEqual(data[2].caption);
    expect(response.body.data[0].photo).toEqual(data[2].photo);
    expect(response.body.data[0].dueDate).toEqual(data[2].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[2].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[2].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[2].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[2].isComplete);
    expect(response.body.data[0].likeCount).toEqual(1);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[1]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[1].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[2].categoryResolutionId);

    expect(response.body.data[1]._id.toString()).toBeDefined();
    expect(response.body.data[1].userId).toEqual(data[1].userId);
    expect(response.body.data[1].categoryResolutionId).toEqual(data[1].categoryResolutionId);
    expect(response.body.data[1].type).toEqual(data[1].type);
    expect(response.body.data[1].caption).toEqual(data[1].caption);
    expect(response.body.data[1].photo).toEqual(data[1].photo);
    expect(response.body.data[1].dueDate).toEqual(data[1].dueDate);
    expect(response.body.data[1].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[1].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[1].shareWith).toEqual(data[1].shareWith);
    expect(response.body.data[1].isComplete).toEqual(data[1].isComplete);
    expect(response.body.data[1].likeCount).toEqual(0);
    expect(response.body.data[1].commentCount).toEqual(0);
    expect(response.body.data[1].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[1].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[1].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[1].userInfo.categoryResolution._id).toEqual(data[1].categoryResolutionId);

    expect(response.body.data[2]._id.toString()).toBeDefined();
    expect(response.body.data[2].userId).toEqual(data[0].userId);
    expect(response.body.data[2].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[2].type).toEqual(data[0].type);
    expect(response.body.data[2].caption).toEqual(data[0].caption);
    expect(response.body.data[2].photo).toEqual(data[0].photo);
    expect(response.body.data[2].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[2].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[2].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[2].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[2].isComplete).toEqual(data[0].isComplete);
    expect(response.body.data[2].likeCount).toEqual(4);
    expect(response.body.data[2].commentCount).toEqual(0);
    expect(response.body.data[2].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[2].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[2].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[2].userInfo.categoryResolution._id).toEqual(data[0].categoryResolutionId);
  });

  it('should be able get all posts (user 3)', async () => {
    const data = await createFakePost();

    const authResponse = await request(app)
      .post(`/v1/users/login`)
      .send({ email: user[3].email, password: '12345678' });
    const token = authResponse.body.token;

    const response = await request(app).get(`/v1/posts`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);
    expect(response.body.results).toEqual(1);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[0].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[0].type);
    expect(response.body.data[0].caption).toEqual(data[0].caption);
    expect(response.body.data[0].photo).toEqual(data[0].photo);
    expect(response.body.data[0].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[0].isComplete);
    expect(response.body.data[0].likeCount).toEqual(4);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[0].categoryResolutionId);
  });

  it('should be able to filter get all posts', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get(`/v1/posts`)
      .query({
        userId: user[0]._id.toString(),
        categoryResolutionId: data[0].categoryResolutionId,
        type: 'resolutions',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[0].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[0].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[0].type);
    expect(response.body.data[0].caption).toEqual(data[0].caption);
    expect(response.body.data[0].photo).toEqual(data[0].photo);
    expect(response.body.data[0].dueDate).toEqual(data[0].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[0].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[0].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[0].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[0].isComplete);
    expect(response.body.data[0].likeCount).toEqual(4);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[0].categoryResolutionId);
  });

  it('should be able to limit results (page 1)', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get('/v1/posts')
      .query({ limit: 1, page: 1 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(1);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[2].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[2].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[2].type);
    expect(response.body.data[0].caption).toEqual(data[2].caption);
    expect(response.body.data[0].photo).toEqual(data[2].photo);
    expect(response.body.data[0].dueDate).toEqual(data[2].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[2].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[2].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[2].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[2].isComplete);
    expect(response.body.data[0].likeCount).toEqual(1);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[1]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[1].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[1].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[2].categoryResolutionId);
  });

  it('should be able to limit results (page 2)', async () => {
    const data = await createFakePost();

    const response = await request(app)
      .get('/v1/posts')
      .query({ limit: 1, page: 2 })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.status).toEqual('success');
    expect(response.body.results).toEqual(1);
    expect(response.body.limit).toEqual(1);
    expect(response.body.page).toEqual(2);

    expect(response.body.data[0]._id.toString()).toBeDefined();
    expect(response.body.data[0].userId).toEqual(data[1].userId);
    expect(response.body.data[0].categoryResolutionId).toEqual(data[1].categoryResolutionId);
    expect(response.body.data[0].type).toEqual(data[1].type);
    expect(response.body.data[0].caption).toEqual(data[1].caption);
    expect(response.body.data[0].photo).toEqual(data[1].photo);
    expect(response.body.data[0].dueDate).toEqual(data[1].dueDate);
    expect(response.body.data[0].createdDate).toEqual(data[1].createdDate);
    expect(response.body.data[0].updatedDate).toEqual(data[1].updatedDate);
    expect(response.body.data[0].shareWith).toEqual(data[1].shareWith);
    expect(response.body.data[0].isComplete).toEqual(data[1].isComplete);
    expect(response.body.data[0].likeCount).toEqual(0);
    expect(response.body.data[0].commentCount).toEqual(0);
    expect(response.body.data[0].userInfo._id).toEqual(user[0]._id);
    expect(response.body.data[0].userInfo.username).toEqual(user[0].username);
    expect(response.body.data[0].userInfo.photo).toEqual(user[0].photo);
    expect(response.body.data[0].userInfo.categoryResolution._id).toEqual(data[1].categoryResolutionId);
  });

  it('should thrown error if user is not logged in', async () => {
    const response = await request(app).get('/v1/posts');

    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
