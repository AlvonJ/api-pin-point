interface LocationInterface {
  name: string;
  latitude: string;
  longitude: string;
}

export interface AttendanceInterface {
  id?: string;
  user: string;
  group: string;
  photo: string;
  location: LocationInterface;
  tagLocation: string;
  date?: Date;
}

export class AttendanceEntity {
  id?: string;
  user: string;
  group: string;
  photo: string;
  location: LocationInterface;
  tagLocation: string;
  date: Date;

  constructor(attendance: AttendanceInterface) {
    this.id = attendance.id;
    this.user = attendance.user;
    this.group = attendance.group;
    this.photo = attendance.photo;
    this.location = attendance.location;
    this.tagLocation = attendance.tagLocation;
    this.date = attendance.date || new Date();
  }

  validate() {
    this.validatePhoto();
    this.validateLocation();
    this.validateTagLocation();
    this.validateUser();
    this.validateDate();
    this.validateGroup();
  }

  private validatePhoto() {
    if (typeof this.photo !== 'string' || this.photo.length === 0) {
      throw new Error('Invalid photo. Photo must be a non-empty string.', { cause: 'ValidationError' });
    }
  }

  private validateLocation() {
    if (
      !this.location ||
      typeof this.location.name !== 'string' ||
      typeof this.location.latitude !== 'string' ||
      typeof this.location.longitude !== 'string' ||
      Object.keys(this.location).length !== 3
    ) {
      throw new Error('Invalid location. Location must have name, latitude, and longitude as strings.', {
        cause: 'ValidationError',
      });
    }
  }

  private validateTagLocation() {
    if (typeof this.tagLocation !== 'string' || this.tagLocation.length === 0) {
      throw new Error('Invalid tagLocation. Tag location must be a non-empty string.', {
        cause: 'ValidationError',
      });
    }
  }

  private validateUser() {
    if (!this.user || typeof this.user !== 'string') {
      throw new Error('Invalid user. User must be string of ID.', {
        cause: 'ValidationError',
      });
    }
  }

  private validateGroup() {
    if (!this.group || typeof this.group !== 'string') {
      throw new Error('Invalid group. Group must be string of ID.', {
        cause: 'ValidationError',
      });
    }
  }

  private validateDate() {
    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      throw new Error('Invalid Date. Date must be a valid Date object.', {
        cause: 'ValidationError',
      });
    }
  }
}
