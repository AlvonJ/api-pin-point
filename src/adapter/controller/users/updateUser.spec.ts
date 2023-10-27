import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('update one user example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able update one user', async () => {
    const data = await createFakeUser();

    const updatedUsername = {
      username: 'updated username',
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/users/${data[1]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUsername);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data.username).not.toEqual(data[1].username);
  });

  it('should be error when no user found with that ID', async () => {
    const data = await createFakeUser();

    const updatedUsername = {
      username: 'updated username',
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/users/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUsername);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('No users found with that id!');
  });

  it('should thrown validation error when username is invalid', async () => {
    const data = await createFakeUser();

    const updatedUsername = {
      username: 'asd@g|',
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/users/${data[1]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUsername);

    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toEqual('error');
  });
});
