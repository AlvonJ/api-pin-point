import { GroupEntity } from '../../entity/GroupEntity.js';

interface QueryParamsInterface {
  limit: number;
  page: number;
}

export async function getAllGroupsInteractor(
  getAllGroupPersistence: (limit: number, page: number) => Promise<Array<any>>,
  queryParams: QueryParamsInterface
): Promise<Array<GroupEntity>> {
  const { limit, page } = queryParams;

  const groups = await getAllGroupPersistence(limit, page);

  return groups;
}
