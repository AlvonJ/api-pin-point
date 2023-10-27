import request from 'supertest';
import { createApp } from '../../../app.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeAttendance } from '../../../infrastructure/database/mongodb/attendances/utils/createFakeAttendance.js';
import { deleteAllAttendances } from '../../../infrastructure/database/mongodb/attendances/utils/deleteAllAttendances.js';
import { AttendanceInterface } from '../../../domain/entity/AttendanceEntity.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('get all attendances from current user example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await deleteAllAttendances();
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get all attendances from current user', async () => {
    const user = await createFakeUser();
    const attendance = await createFakeAttendance();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const payload: AttendanceInterface = {
      user: user[0]._id.toString(),
      group: 'Abmkmd51421KDadas',
      location: { latitude: '12313', longitude: '-123213', name: 'Jalan Timur' },
      photo: 'photourl.com',
      tagLocation: 'Rumah 1',
      date: new Date(),
    };

    const newAttendance = await request(app).post('/attendances').send(payload).set('Authorization', `Bearer ${token}`);
    const response = await request(app).get('/attendances/getMe').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    expect(response.body.data.length).toEqual(1);

    // expect response json
    // data 1
    expect(response.body.data[0]._id.toString()).toEqual(newAttendance.body.data._id.toString());
    expect(response.body.data[0].group).toEqual(newAttendance.body.data.group);
    expect(response.body.data[0].user).toEqual(newAttendance.body.data.user);
    expect(response.body.data[0].tagLocation).toEqual(newAttendance.body.data.tagLocation);
    expect(response.body.data[0].photo).toEqual(newAttendance.body.data.photo);
    expect(response.body.data[0].location).toEqual(newAttendance.body.data.location);
  });

  it('should thrown data not found error if no groups found', async () => {
    const user = await createFakeUser();
    await deleteAllAttendances();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/attendances/getMe').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);

    // expect response json
    expect(response.body.status).toEqual('error');
  });
});
