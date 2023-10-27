import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('delete user example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able delete user (admin only)', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/users/${data[1]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});
  });

  it('should thrown not found error (404) if not able to find user (admin only)', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/users/123456bd60bb49fe10c7b719`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);
  });

  it('should thrown unauthorized error error (401) if not logged in', async () => {
    const data = await createFakeUser();

    const response = await request(app).delete(`/users/123456bd60bb49fe10c7b719`);

    // expect http response
    expect(response.statusCode).toEqual(401);
    expect(response.body.status).toEqual('error');
  });
});
