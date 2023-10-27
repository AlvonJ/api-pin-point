import { GroupEntity, GroupInterface } from '../../entity/GroupEntity.js';

export async function updateGroupInteractor(
  updateGroupPersistence: (group: GroupInterface) => Promise<any>,
  group: GroupInterface
): Promise<GroupEntity> {
  // Create a new GroupEntity instance
  const updatedGroupObject = new GroupEntity(group);

  // Check if username and password valid
  updatedGroupObject.validate();

  // Update the Group using the provided persistence function
  const updatedGroup = await updateGroupPersistence(group);

  return updatedGroup;
}
