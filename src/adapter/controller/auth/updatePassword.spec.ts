import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('update current password example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able to update user password', async () => {
    const user = await createFakeUser();

    const loginResponse = await request(app).post('/users/login').send({ email: user[0].email, password: '12345678' });
    const { token } = loginResponse.body;

    const response = await request(app)
      .patch('/users/updateMyPassword')
      .send({
        passwordCurrent: '12345678',
        passwordNew: '123456',
      })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.username).toEqual(loginResponse.body.data.user.username);
    expect(response.body.data.user.password).toBeUndefined();
  });

  it('should thrown error if current password is wrong', async () => {
    const user = await createFakeUser();

    const loginResponse = await request(app).post('/users/login').send({ email: user[0].email, password: '12345678' });
    const { token } = loginResponse.body;

    const response = await request(app)
      .patch('/users/updateMyPassword')
      .send({
        passwordCurrent: '1234567',
        passwordNew: '123456',
      })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(401);

    // expect response json
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if new password length is lower than 6', async () => {
    const user = await createFakeUser();

    const loginResponse = await request(app).post('/users/login').send({ email: user[0].email, password: '12345678' });
    const { token } = loginResponse.body;

    const response = await request(app)
      .patch('/users/updateMyPassword')
      .send({
        passwordCurrent: '12345678',
        passwordNew: '123',
      })
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(400);

    // expect response json
    expect(response.body.status).toEqual('error');
  });
});
