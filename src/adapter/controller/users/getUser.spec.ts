import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('get one user example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get one user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get(`/users/${data[0]._id.toString()}`).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data._id.toString()).toEqual(data[0]._id.toString());
    expect(response.body.data.username).toEqual(data[0].username);
    expect(response.body.data.email).toEqual(data[0].email);
    expect(response.body.data.phone).toEqual(data[0].phone);
    expect(response.body.data.photo).toEqual(data[0].photo);
    expect(response.body.data.role).toEqual(data[0].role);
    expect(response.body.data.password).toBeUndefined();
  });

  it('should be error when no user found', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get(`/users/12325320b7681b6c0b567bd5`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('No users found with that ID');
  });
});
