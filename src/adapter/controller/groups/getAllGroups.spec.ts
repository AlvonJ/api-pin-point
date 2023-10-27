import request from 'supertest';
import { createApp } from '../../../app.js';
import { resetDatabase } from '../../../infrastructure/database/mongodb/utils/resetDatabase.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeGroup } from '../../../infrastructure/database/mongodb/groups/utils/createFakeGroup.js';
import { deleteAllGroups } from '../../../infrastructure/database/mongodb/groups/utils/deleteAllGroups.js';

describe('get all groups example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await resetDatabase();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get all group', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/groups').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    // data 1
    expect(response.body.data[0]._id.toString()).toEqual(group[0]._id.toString());
    expect(response.body.data[0].name).toEqual(group[0].name);
    expect(response.body.data[0].admin).toEqual(group[0].admin);
    expect(response.body.data[0].tagLocation).toEqual(group[0].tagLocation);
    expect(response.body.data[0].invitations).toEqual(group[0].invitations);
  });

  it('should be able to limit results', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/groups').query({ limit: 1 }).set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.results).toEqual(1);
  });

  it('should thrown data not found error if no groups found', async () => {
    const user = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get('/groups').set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(404);

    // expect response json
    expect(response.body.status).toEqual('error');
  });
});
