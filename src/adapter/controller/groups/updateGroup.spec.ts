import request from 'supertest';
import { createApp } from '../../../app.js';
import { resetDatabase } from '../../../infrastructure/database/mongodb/utils/resetDatabase.js';
import { createFakeUser } from '../../../infrastructure/database/mongodb/users/utils/createFakeUser.js';
import { createFakeGroup } from '../../../infrastructure/database/mongodb/groups/utils/createFakeGroup.js';

describe('update one group example', () => {
  let app;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await resetDatabase();
  });

  beforeAll(async () => {
    app = createApp();
  });

  it('should be able update one group', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const updatedGroup = {
      name: 'Updated Name',
      member: ['1232131212', group[0].member[0]],
      tagLocation: ['Tag 1', group[0].tagLocation[0]],
      invitations: [
        { user: '1515151511', status: 'pending' },
        { user: group[0].invitations[0].user, status: 'accepted' },
      ],
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGroup);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.data.name).not.toEqual(group[0].name);
  });

  it('should thrown validation error if name is invalid when updating one group', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const updatedGroup = {
      name: 123,
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGroup);

    // expect http response
    expect(response.statusCode).toEqual(400);

    // expect response json
    expect(response.body.status).toEqual('error');
  });

  it('should thrown error if updated name is already taken', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const updatedGroup = {
      name: group[1].name,
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGroup);

    // expect http response
    expect(response.statusCode).toEqual(400);

    // expect response json
    expect(response.body.status).toEqual('error');
  });

  it('should be error when no group found with that ID', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const updatedGroup = {
      name: 'Updated Name',
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[0].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/groups/12325320b7681b6c0b567bd5`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGroup);

    expect(response.statusCode).toEqual(404);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('No groups found with that id!');
  });

  it('should not be able update member/name if not admin', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const updatedGroup = {
      name: 'Updated Name',
      member: ['sadasdasdas'],
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[1].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGroup);

    // expect http response
    expect(response.statusCode).toEqual(401);

    // expect response json
    expect(response.body.status).toEqual('error');
  });

  it('should not be able update invitations of another user if not admin', async () => {
    const user = await createFakeUser();
    const group = await createFakeGroup();

    const updatedGroup = {
      invitations: [
        {
          user: '12325320b7681b6c0b567bd5',
          status: 'pending',
        },
      ],
    };

    const authResponse = await request(app).post(`/users/login`).send({ email: user[1].email, password: '12345678' });
    const { token } = authResponse.body;

    const response = await request(app)
      .patch(`/groups/${group[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGroup);

    // expect http response
    expect(response.statusCode).toEqual(401);

    // expect response json
    expect(response.body.status).toEqual('error');
  });
});
