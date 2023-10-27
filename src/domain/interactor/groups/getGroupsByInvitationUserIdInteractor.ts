import { GroupEntity } from '../../entity/GroupEntity.js';

export async function getGroupsByInvitationUserIdInteractor(
  getGroupsByInvitationUserIdPersistence: (userId: string) => Promise<Array<any>>,
  userId: string
): Promise<Array<GroupEntity>> {
  const groups = await getGroupsByInvitationUserIdPersistence(userId);

  return groups;
}
