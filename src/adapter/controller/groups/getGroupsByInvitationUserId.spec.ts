import request from 'supertest';
import { createApp } from '../../../app.js';
import { resetDatabase } from '../../../infrastructure/database/mongodb/utils/resetDatabase.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeGroup } from '../../../infrastructure/database/mongodb/groups/utils/createFakeGroup.js';
import { GroupInterface } from '../../../domain/entity/GroupEntity.js';

describe('get all groups by invitation current user id example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(30000);
    await resetDatabase();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get all group depends on the invitations', async () => {
    const user = await createFakeUser();
    const data: GroupInterface = {
      name: 'Group 1',
      admin: '653456bd60bb49fe10c7b719',
      tagLocation: [],
      member: [],
      invitations: [{ user: user[0]._id.toString(), status: 'pending' }],
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const group = await request(app).post('/groups').send(data).set('Authorization', `Bearer ${token}`);
    const response = await request(app).get('/groups/invitations/getMe').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data[0]._id.toString()).toEqual(group.body.data._id.toString());
    expect(response.body.data[0].name).toEqual(group.body.data.name);
    expect(response.body.data[0].admin).toEqual(group.body.data.admin);
    expect(response.body.data[0].tagLocation).toEqual(group.body.data.tagLocation);
    expect(response.body.data[0].invitations).toEqual(group.body.data.invitations);
  });

  it('should thrown error if groups not found', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/groups/invitations/getMe').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);

    // expect response json
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('No groups found');
  });
});
