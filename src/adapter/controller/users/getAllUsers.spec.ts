import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('get all user example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get all user', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    // data 1
    expect(response.body.data[0]._id.toString()).toEqual(data[0]._id.toString());
    expect(response.body.data[0].username).toEqual(data[0].username);
    expect(response.body.data[0].email).toEqual(data[0].email);
    expect(response.body.data[0].phone).toEqual(data[0].phone);
    expect(response.body.data[0].photo).toEqual(data[0].photo);
    expect(response.body.data[0].role).toEqual(data[0].role);
    expect(response.body.data[0].password).toBeUndefined();

    // data 2
    expect(response.body.data[1]._id.toString()).toEqual(data[1]._id.toString());
    expect(response.body.data[1].username).toEqual(data[1].username);
    expect(response.body.data[1].email).toEqual(data[1].email);
    expect(response.body.data[1].phone).toEqual(data[1].phone);
    expect(response.body.data[1].photo).toEqual(data[1].photo);
    expect(response.body.data[1].role).toEqual(data[1].role);
    expect(response.body.data[1].password).toBeUndefined();
  });

  it('should be able to limit results', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/users').query({ limit: 1 }).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.results).toEqual(1);
  });

  it('should thrown "You do not have permission to perform this action" error if user is not admin', async () => {
    const data = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: data[1].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(403);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('You do not have permission to perform this action');
  });
});
