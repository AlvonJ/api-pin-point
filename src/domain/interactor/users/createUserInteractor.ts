import { UserEntity, UserInterface } from '../../entity/UserEntity.js';

export async function createUserInteractor(
  createUserPersistence: (user: UserInterface) => Promise<any>,
  user: UserInterface
): Promise<UserInterface> {
  const userObject = new UserEntity(user);

  userObject.validate();

  const validatedUser = {
    ...user,
    email: user.email.toLowerCase(),
    role: userObject.role,
    phone: user.phone ?? userObject.phone,
    photo: user.photo ?? userObject.photo,
  };

  const newUser = await createUserPersistence(validatedUser);

  return newUser;
}
