import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeAttendance } from '../../../infrastructure/database/mongodb/attendances/utils/createFakeAttendance.js';
import { deleteAllAttendances } from '../../../infrastructure/database/mongodb/attendances/utils/deleteAllAttendances.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('get all attendances example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await deleteAllAttendances();
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get all group', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/attendances').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    // data 1
    expect(response.body.data[0]._id.toString()).toEqual(attendance[0]._id.toString());
    expect(response.body.data[0].group).toEqual(attendance[0].group);
    expect(response.body.data[0].user).toEqual(attendance[0].user);
    expect(response.body.data[0].tagLocation).toEqual(attendance[0].tagLocation);
    expect(response.body.data[0].photo).toEqual(attendance[0].photo);
    expect(response.body.data[0].location).toEqual(attendance[0].location);

    // data 2
    expect(response.body.data[1]._id.toString()).toEqual(attendance[1]._id.toString());
    expect(response.body.data[1].group).toEqual(attendance[1].group);
    expect(response.body.data[1].user).toEqual(attendance[1].user);
    expect(response.body.data[1].tagLocation).toEqual(attendance[1].tagLocation);
    expect(response.body.data[1].photo).toEqual(attendance[1].photo);
    expect(response.body.data[1].location).toEqual(attendance[1].location);
  });

  it('should be able to limit results', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/attendances').query({ limit: 1 }).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.results).toEqual(1);
  });

  it('should be able to filter results', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get('/attendances')
      .query({
        startDate: '2023-01-01',
        endDate: '2030-01-01',
        userId: [`${attendance[0].user},${attendance[1].user}`],
      })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.results).toEqual(2);
  });

  it('should thrown data not found error if no groups found', async () => {
    const user = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/attendances').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);

    // expect response json
    expect(response.body.status).toEqual('error');
  });
});
