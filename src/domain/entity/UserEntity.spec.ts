import { UserEntity, UserInterface } from './UserEntity.js'; // Import the UserEntity class and UserInterface

describe('UserEntity', () => {
  // Define some sample user data for testing
  const sampleUserData: UserInterface = {
    email: 'test@example.com',
    phone: '1234567890',
    username: 'testuser',
    password: 'password123',
    photo: 'asdsada.jpg',
  };

  // Test the constructor and validation methods
  it('should create a UserEntity instance with valid data', () => {
    const userEntity = new UserEntity(sampleUserData);

    // Ensure the instance was created successfully
    expect(userEntity).toBeDefined();

    // Ensure properties are set correctly
    expect(userEntity.id).toBeUndefined();
    expect(userEntity.email).toBe(sampleUserData.email);
    expect(userEntity.phone).toBe(sampleUserData.phone);
    expect(userEntity.username).toBe(sampleUserData.username);
    expect(userEntity.password).toBe(sampleUserData.password);
    expect(userEntity.photo).toBe(sampleUserData.photo);
    expect(userEntity.role).toBe('user');
    expect(userEntity.isUpdating).toBe(false);

    // Validate the user
    expect(() => userEntity.validate()).not.toThrow();
  });

  it('should throw an error when creating a UserEntity instance with invalid email', () => {
    const invalidUserData: UserInterface = {
      email: 'invalid-email', // Invalid email
      phone: '1234567890',
      username: 'testuser',
      password: 'short123',
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });

  it('should throw an error when creating a UserEntity instance with invalid phone', () => {
    const invalidUserData: UserInterface = {
      email: 'test@gmail.com',
      phone: '1234567890a', // Phone contains alphabet
      username: 'testuser',
      password: 'short123',
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });

  it('should throw an error when creating a UserEntity instance with invalid username', () => {
    const invalidUserData: UserInterface = {
      email: 'test@gmail.com',
      phone: '1234567890',
      username: 'testuser@', // Username contains special characters
      password: 'short123',
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });

  it('should throw an error when creating a UserEntity with no phone', () => {
    const invalidUserData: UserInterface = {
      email: 'test@gmail.com',
      phone: undefined,
      username: 'testuser',
      password: 'short123',
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });

  it('should throw an error when creating a UserEntity with no email', () => {
    const invalidUserData: UserInterface = {
      email: undefined,
      phone: '1234567890',
      username: 'testuser',
      password: 'short123',
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });

  it('should throw an error when creating a UserEntity with no username', () => {
    const invalidUserData: UserInterface = {
      email: 'test@gmail.com',
      phone: '1234567890',
      username: undefined,
      password: 'short123',
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });

  it('should throw an error when creating a UserEntity with no password', () => {
    const invalidUserData: UserInterface = {
      email: 'test@gmail.com',
      phone: '1234567890',
      username: 'testuser',
      password: undefined,
      photo: 'asdsada.jpg',
    };

    expect(() => new UserEntity(invalidUserData).validate()).toThrow();
  });
});
