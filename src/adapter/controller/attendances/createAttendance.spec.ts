import request from 'supertest';
import { createApp } from '../../../app.js';
import { AttendanceInterface } from '../../../domain/entity/AttendanceEntity.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllAttendances } from '../../../infrastructure/database/mongodb/attendances/utils/deleteAllAttendances.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';

describe('create attendance example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllAttendances();
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able to create an example', async () => {
    const user = await createFakeUser();

    const attendance: AttendanceInterface = {
      user: user[1]._id.toString(),
      group: 'Abmkmd51421KDadas',
      location: { latitude: '12313', longitude: '-123213', name: 'Jalan Timur' },
      photo: 'photourl.com',
      tagLocation: 'Rumah 1',
      date: new Date(),
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[1].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).post('/attendances').send(attendance).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(201);

    // expect response json
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.user).toEqual(attendance.user);
    expect(response.body.data.group).toEqual(attendance.group);
    expect(response.body.data.location).toEqual(attendance.location);
    expect(response.body.data.photo).toEqual(attendance.photo);
    expect(response.body.data.tagLocation).toEqual(attendance.tagLocation);
    expect(response.body.data.date).not.toBeNull();
  });

  it('validation error should occured if location.name is not string', async () => {
    const user = await createFakeUser();

    const invalidAttendance: any = {
      user: user[1]._id.toString(),
      group: 'Abmkmd51421KDadas',
      location: { latitude: '12313', longitude: '-123213', name: 12312 },
      photo: 'photourl.com',
      tagLocation: 'Rumah 1',
      date: new Date(),
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .post('/attendances')
      .send(invalidAttendance)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toBe('error');
  });
});
