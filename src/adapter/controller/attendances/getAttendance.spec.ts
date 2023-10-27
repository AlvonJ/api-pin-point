import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeAttendance } from '../../../infrastructure/database/mongodb/attendances/utils/createFakeAttendance.js';
import { deleteAllAttendances } from '../../../infrastructure/database/mongodb/attendances/utils/deleteAllAttendances.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('get one attendance example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllAttendances();
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get one attendance', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/attendances/${attendance[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data._id.toString()).toEqual(attendance[0]._id.toString());
    expect(response.body.data.group).toEqual(attendance[0].group);
    expect(response.body.data.user).toEqual(attendance[0].user);
    expect(response.body.data.tagLocation).toEqual(attendance[0].tagLocation);
    expect(response.body.data.photo).toEqual(attendance[0].photo);
    expect(response.body.data.location).toEqual(attendance[0].location);
  });

  it('should be error when no attendance found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/attendances/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('No attendances found with that ID');
  });
});
