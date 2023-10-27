import { GroupEntity, GroupInterface } from '../../entity/GroupEntity.js';

export async function createGroupInteractor(
  createGroupPersistence: (group: GroupInterface) => Promise<any>,
  group: GroupInterface
): Promise<GroupInterface> {
  const groupObject = new GroupEntity(group);

  groupObject.validate();

  const validatedGroup = {
    ...group,
    member: group.member ?? groupObject.member,
    tagLocation: group.tagLocation ?? groupObject.tagLocation,
    invitations: group.invitations ?? groupObject.invitations,
  };

  const newGroup = await createGroupPersistence(validatedGroup);

  return newGroup;
}
