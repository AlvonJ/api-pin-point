import request from 'supertest';
import { createApp } from '../../../app.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { UserInterface } from '../../../domain/entity/UserEntity.js';

describe('create register example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await deleteAllUsers();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able to register user', async () => {
    const user: UserInterface = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
      phone: '089512313',
    };

    const response = await request(app).post('/users/register').send(user);

    // expect http response
    expect(response.statusCode).toEqual(201);

    // expect response json
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.username).toEqual(user.username);
    expect(response.body.data.user.email).toEqual(user.email);
    expect(response.body.data.user.phone).toEqual(user.phone);
    expect(response.body.data.user.role).toEqual('user');
    expect(response.body.data.user.password).toBeUndefined();
  });

  it('should thrown error if password length is lower than 6', async () => {
    const user: UserInterface = {
      username: 'test',
      email: 'test@gmail.com',
      password: '123',
      phone: '089512313',
    };

    const response = await request(app).post('/users/register').send(user);

    // expect http response
    expect(response.statusCode).toEqual(400);

    // expect response json
    expect(response.body.status).toEqual('error');
  });

  it('should thrown validation error if phone contains aplhabet', async () => {
    const user: UserInterface = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
      phone: '08bs9512313',
    };

    const response = await request(app).post('/users/register').send(user);

    // expect http response
    expect(response.statusCode).toEqual(400);

    // expect response json
    expect(response.body.status).toEqual('error');
  });
});
