import { AttendanceEntity, AttendanceInterface } from './AttendanceEntity.js'; // Import the AttendanceEntity class and AttendanceInterface

describe('AttendanceEntity', () => {
  // Test the constructor and validation methods
  it('should create a AttendanceEntity instance with valid data', () => {
    // Define some sample attendance data for testing
    const sampleAttendanceData: AttendanceInterface = {
      user: 'A537512dgsbssfs2c554381',
      group: 'bd1519ffSObasfI0powrw',
      photo: 'photo.url',
      tagLocation: 'rumah 1',
      location: {
        name: 'Jalan Lengkong',
        latitude: '1321321231',
        longitude: '-123213213',
      },
    };

    const attendanceEntity = new AttendanceEntity(sampleAttendanceData);

    // Ensure the instance was created successfully
    expect(attendanceEntity).toBeDefined();

    // Ensure properties are set correctly
    expect(attendanceEntity.id).toBeUndefined();
    expect(attendanceEntity.user).toBe(sampleAttendanceData.user);
    expect(attendanceEntity.group).toBe(sampleAttendanceData.group);
    expect(attendanceEntity.photo).toBe(sampleAttendanceData.photo);
    expect(attendanceEntity.tagLocation).toBe(sampleAttendanceData.tagLocation);
    expect(attendanceEntity.location).toBe(sampleAttendanceData.location);
    expect(attendanceEntity.location.name).toBe(sampleAttendanceData.location.name);
    expect(attendanceEntity.location.latitude).toBe(sampleAttendanceData.location.latitude);
    expect(attendanceEntity.location.longitude).toBe(sampleAttendanceData.location.longitude);
    expect(attendanceEntity.date).not.toBeNull();

    // Validate the group
    expect(() => attendanceEntity.validate()).not.toThrow();
  });

  it('should throw an error when creating a AttendanceEntity instance with invalid photo', () => {
    const invalidAttendanceData: AttendanceInterface = {
      user: 'A537512dgsbssfs2c554381',
      group: 'bd1519ffSObasfI0powrw',
      photo: undefined,
      tagLocation: 'rumah 1',
      location: {
        name: 'Jalan Lengkong',
        latitude: '1321321231',
        longitude: '-123213213',
      },
    };

    expect(() => new AttendanceEntity(invalidAttendanceData).validate()).toThrow();
  });

  it('should throw an error when creating a AttendanceEntity instance with invalid user', () => {
    const invalidAttendanceData: AttendanceInterface = {
      user: undefined,
      group: 'bd1519ffSObasfI0powrw',
      photo: 'photo.url',
      tagLocation: 'rumah 1',
      location: {
        name: 'Jalan Lengkong',
        latitude: '1321321231',
        longitude: '-123213213',
      },
    };

    expect(() => new AttendanceEntity(invalidAttendanceData).validate()).toThrow();
  });

  it('should throw an error when creating a AttendanceEntity instance with invalid group', () => {
    const invalidAttendanceData: AttendanceInterface = {
      user: 'A537512dgsbssfs2c554381',
      group: undefined,
      photo: 'photo.url',
      tagLocation: 'rumah 1',
      location: {
        name: 'Jalan Lengkong',
        latitude: '1321321231',
        longitude: '-123213213',
      },
    };

    expect(() => new AttendanceEntity(invalidAttendanceData).validate()).toThrow();
  });

  it('should throw an error when creating a AttendanceEntity instance with invalid tagLocation', () => {
    const invalidAttendanceData: AttendanceInterface = {
      user: 'A537512dgsbssfs2c554381',
      group: 'bd1519ffSObasfI0powrw',
      photo: 'photo.url',
      tagLocation: undefined,
      location: {
        name: 'Jalan Lengkong',
        latitude: '1321321231',
        longitude: '-123213213',
      },
    };

    expect(() => new AttendanceEntity(invalidAttendanceData).validate()).toThrow();
  });

  it('should throw an error when creating a AttendanceEntity instance with invalid location', () => {
    const invalidAttendanceData: AttendanceInterface = {
      user: 'A537512dgsbssfs2c554381',
      group: 'bd1519ffSObasfI0powrw',
      photo: 'photo.url',
      tagLocation: 'rumah 1',
      location: undefined,
    };

    expect(() => new AttendanceEntity(invalidAttendanceData).validate()).toThrow();
  });

  it('should throw an error when creating a AttendanceEntity instance with invalid date', () => {
    const invalidAttendanceData: any = {
      user: 'A537512dgsbssfs2c554381',
      group: 'bd1519ffSObasfI0powrw',
      photo: 'photo.url',
      tagLocation: 'rumah 1',
      location: {
        name: 'Jalan Lengkong',
        latitude: '1321321231',
        longitude: '-123213213',
      },
      date: 123,
    };

    expect(() => new AttendanceEntity(invalidAttendanceData).validate()).toThrow();
  });
});
