import { GroupEntity } from '../../entity/GroupEntity.js';

export async function getGroupInteractor(
  getGroupPersistence: (id: string) => Promise<any>,
  id: string
): Promise<GroupEntity> {
  const group = await getGroupPersistence(id);

  return group;
}
