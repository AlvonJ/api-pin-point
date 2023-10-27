import { UserEntity } from '../../entity/UserEntity.js';

interface QueryParamsInterface {
  limit: number;
  page: number;
}

export async function getAllUserInteractor(
  getAllUserPersistence: (limit: number, page: number) => Promise<Array<any>>,
  queryParams: QueryParamsInterface
): Promise<Array<UserEntity>> {
  const { limit, page } = queryParams;

  const users = await getAllUserPersistence(limit, page);

  return users;
}
