import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';

describe('update current user example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able update current user', async () => {
    const data = await createFakeUser();

    const updatedUsername = {
      username: 'updated username',
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: data[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/users/updateMe`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUsername);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data.username).not.toEqual(data[0].username);
  });
});
