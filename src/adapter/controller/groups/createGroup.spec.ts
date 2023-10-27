import request from 'supertest';
import { createApp } from '../../../app.js';
import { GroupInterface } from '../../../domain/entity/GroupEntity.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { deleteAllUsers } from '../../../infrastructure/database/mongodb/users/utils/deleteAllUsers.js';
import { deleteAllGroups } from '../../../infrastructure/database/mongodb/groups/utils/deleteAllGroups.js';

describe('create attendance example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await deleteAllUsers();
    await deleteAllGroups();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able to create an example', async () => {
    const user = await createFakeUser();

    const group: GroupInterface = {
      name: 'Group 1',
      admin: '653456bd60bb49fe10c7b719',
      tagLocation: [],
      member: [],
      invitations: [{ user: '6536355ee6c5ec4815884c6b', status: 'pending' }],
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).post('/groups').send(group).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(201);

    // expect response json
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.name).toEqual(group.name);
    expect(response.body.data.admin).toEqual(group.admin);
    expect(response.body.data.tagLocation).toEqual(group.tagLocation);
    expect(response.body.data.member).toEqual(group.member);
    expect(response.body.data.invitations).toEqual(group.invitations);
  });

  it('duplicate error should occured if name is duplicate', async () => {
    const user = await createFakeUser();

    const group1: GroupInterface = {
      name: 'Group 1',
      admin: '653456bd60bb49fe10c7b719',
      tagLocation: [],
      member: [],
      invitations: [{ user: '6536355ee6c5ec4815884c6b', status: 'pending' }],
    };

    const group2: GroupInterface = {
      name: 'Group 1',
      admin: '653456bd60bb49fe10c7b719',
      tagLocation: [],
      member: [],
      invitations: [{ user: '6536355ee6c5ec4815884c6b', status: 'pending' }],
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response1 = await request(app).post('/groups').send(group1).set('Authorization', `Bearer ${token}`);
    const response2 = await request(app).post('/groups').send(group2).set('Authorization', `Bearer ${token}`);

    expect(response2.statusCode).toEqual(400);
    expect(response2.body.status).toBe('error');
  });
});
