import request from 'supertest';
import { createApp } from '../../../app.js';
import { resetDatabase } from '../../../infrastructure/database/mongodb/utils/resetDatabase.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeGroup } from '../../../infrastructure/database/mongodb/groups/utils/createFakeGroup.js';

describe('get one group example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await resetDatabase();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able get one group', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .get(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data._id.toString()).toEqual(group[0]._id.toString());
    expect(response.body.data.name).toEqual(group[0].name);
    expect(response.body.data.admin).toEqual(group[0].admin);
    expect(response.body.data.tagLocation).toEqual(group[0].tagLocation);
    expect(response.body.data.invitations).toEqual(group[0].invitations);
  });

  it('should be error when no group found', async () => {
    const user = await createFakeUser();

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app).get(`/groups/12325320b7681b6c0b567bd5`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('No groups found with that ID');
  });
});
