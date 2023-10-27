import { UserEntity } from '../../entity/UserEntity.js';

export async function getUserInteractor(
  getUserPersistence: (id: string, projection?: boolean) => Promise<any>,
  id: string,
  projection?: boolean
): Promise<UserEntity> {
  const user = await getUserPersistence(id, projection);

  return user;
}
