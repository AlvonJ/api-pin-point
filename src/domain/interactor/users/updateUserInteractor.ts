import { UserEntity, UserInterface } from '../../entity/UserEntity.js';

export async function updateUserInteractor(
  updateUserPersistence: (user: UserInterface) => Promise<any>,
  user: UserInterface
): Promise<UserEntity> {
  // Create a new UserEntity instance
  const updatedUserObject = new UserEntity(user);

  // Check if username and password valid
  updatedUserObject.validate();

  // Update the user using the provided persistence function
  const updatedUser = await updateUserPersistence(user);

  return updatedUser;
}
