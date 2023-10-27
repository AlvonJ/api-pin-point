import { GroupEntity, GroupInterface } from './GroupEntity.js'; // Import the GroupEntity class and GroupInterface

describe('GroupEntity', () => {
  // Define some sample user data for testing

  // Test the constructor and validation methods
  it('should create a GroupEntity instance with valid data', () => {
    const sampleGroupData: GroupInterface = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending' }],
    };

    const groupEntity = new GroupEntity(sampleGroupData);

    // Ensure the instance was created successfully
    expect(groupEntity).toBeDefined();

    // Ensure properties are set correctly
    expect(groupEntity.id).toBeUndefined();
    expect(groupEntity.name).toBe(sampleGroupData.name);
    expect(groupEntity.admin).toBe(sampleGroupData.admin);
    expect(groupEntity.member).toBe(sampleGroupData.member);
    expect(groupEntity.invitations).toBe(sampleGroupData.invitations);
    expect(groupEntity.tagLocation).toBe(sampleGroupData.tagLocation);
    expect(groupEntity.isUpdating).toBe(false);

    // Validate the group
    expect(() => groupEntity.validate()).not.toThrow();
  });

  // Test the constructor and validation methods
  it('should create a GroupEntity instance with default value data', () => {
    const sampleGroupData: GroupInterface = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
    };

    const groupEntity = new GroupEntity(sampleGroupData);

    // Ensure the instance was created successfully
    expect(groupEntity).toBeDefined();

    // Ensure properties are set correctly
    expect(groupEntity.id).toBeUndefined();
    expect(groupEntity.name).toBe(sampleGroupData.name);
    expect(groupEntity.admin).toBe(sampleGroupData.admin);
    expect(groupEntity.member).toStrictEqual([]);
    expect(groupEntity.invitations).toStrictEqual([]);
    expect(groupEntity.tagLocation).toStrictEqual([]);
    expect(groupEntity.isUpdating).toBe(false);

    // Validate the group
    expect(() => groupEntity.validate()).not.toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid name', () => {
    const invalidGroupData: GroupInterface = {
      name: undefined, // Invalid name
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending' }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid admin', () => {
    const invalidGroupData: GroupInterface = {
      name: 'Group 1',
      admin: undefined, // Invalid admin
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending' }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid member', () => {
    const invalidGroupData: GroupInterface = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: [undefined, 'Lp537512dnsbswfs2cbsb0'], // Invalid member
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending' }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid tagLocation', () => {
    const invalidGroupData: GroupInterface = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: [undefined], // Invalid tagLocation
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending' }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid invitations (status is undefined)', () => {
    const invalidGroupData: GroupInterface = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: undefined }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid invitations (message is not string)', () => {
    const invalidGroupData: any = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending', message: 123 }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid invitations (object length is not 3)', () => {
    const invalidGroupData: any = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: [{ user: 'bd1519ffSObasfI0powrw', status: 'pending', message: 'message', test: 'test' }],
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });

  it('should throw an error when creating a GroupEntity instance with invalid invitations (not array)', () => {
    const invalidGroupData: any = {
      name: 'Group 1',
      admin: '65377b03af8f4c8a2c554380',
      member: ['A537512dgsbssfs2c554381', 'Lp537512dnsbswfs2cbsb0'],
      tagLocation: ['Tag 1'],
      invitations: 'test',
    };

    expect(() => new GroupEntity(invalidGroupData).validate()).toThrow();
  });
});
