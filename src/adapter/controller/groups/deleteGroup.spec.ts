import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeGroup } from '../../../infrastructure/database/mongodb/groups/utils/createFakeGroup.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { resetDatabase } from '../../../infrastructure/database/mongodb/utils/resetDatabase.js';

describe('delete group example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await resetDatabase();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able delete group (admin only)', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});
  });

  it('should thrown not found error (404) if not able to find group (admin only)', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/groups/123456bd60bb49fe10c7b719`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);
  });
});
