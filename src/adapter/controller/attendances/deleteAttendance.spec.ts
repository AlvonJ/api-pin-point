import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeAttendance } from '../../../infrastructure/database/mongodb/attendances/utils/createFakeAttendance.js';
import { deleteAllAttendances } from '../../../infrastructure/database/mongodb/attendances/utils/deleteAllAttendances.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('delete attendance example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllAttendances();
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able delete attendance (admin only)', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/attendances/${attendance[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});
  });

  it('should thrown not found error (404) if not able to find attendance (admin only)', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .delete(`/attendances/123456bd60bb49fe10c7b719`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);
  });
});
