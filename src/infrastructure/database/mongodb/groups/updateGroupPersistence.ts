import { ObjectId } from 'mongodb';
import { GroupInterface } from '../../../../domain/entity/GroupEntity.js';
import { client } from '../index.js';
import { getGroupPersistence } from './getGroupPersistence.js';

function cleanNullValues(obj: Object): void {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
}

export async function updateGroupPersistence(group: GroupInterface) {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('pin-point');

    const groupsCollection = db.collection('groups');

    // Check if group name is already taken
    if (group.name) {
      const isFoundDuplicate = await groupsCollection.findOne({
        name: { $regex: new RegExp(`^${group.name}$`, 'i') },
        _id: { $ne: new ObjectId(group.id) }, // Exclude the current group from duplication check
      });

      // Throw error if group name is already taken
      if (isFoundDuplicate) throw new Error('Name of group has already been taken', { cause: 'DuplicateError' });
    }

    const groupDocument = await groupsCollection.findOne({ _id: new ObjectId(group.id) });

    // Throw error if group is not found
    if (!groupDocument) throw new Error('No groups found with that id!', { cause: 'DataNotFound' });

    if (group.member) {
      const memberSet = new Set(groupDocument.member);

      for (const item of group.member) {
        // If member is already in group, delete the member
        if (memberSet.has(item)) {
          memberSet.delete(item);
        } else {
          // Else add the member to the group
          memberSet.add(item);
        }
      }

      groupDocument.member = Array.from(memberSet);
    }

    if (group.tagLocation) {
      const tagLocationSet = new Set(groupDocument.tagLocation);

      for (const item of group.tagLocation) {
        // If member is already in group, delete the member
        if (tagLocationSet.has(item)) {
          tagLocationSet.delete(item);
        } else {
          // Else add the member to the group
          tagLocationSet.add(item);
        }
      }

      groupDocument.tagLocation = Array.from(tagLocationSet);
    }

    if (group.invitations) {
      const merged = [...groupDocument.invitations];

      for (const invitation of group.invitations) {
        const existingUserIndex = merged.findIndex(sourceUser => sourceUser.user === invitation.user);

        if (existingUserIndex !== -1) {
          // User already exists, replace the object
          merged[existingUserIndex] = invitation;
        } else {
          if (invitation.status.toLowerCase() === 'accepted') {
            throw new Error('The User don’t get the invitation', { cause: 'ValidationError' });
          }
          // User doesn't exist, add the object
          merged.push(invitation);
        }
      }

      groupDocument.invitations = merged;
    }

    const updateValues = {
      name: group.name,
      member: groupDocument.member,
      tagLocation: groupDocument.tagLocation,
      invitations: groupDocument.invitations,
    };

    cleanNullValues(updateValues);

    const updateGroup = {
      $set: updateValues,
    };

    await groupsCollection.updateOne({ _id: new ObjectId(group.id) }, updateGroup);

    return getGroupPersistence(group.id);
  } catch (err) {
    throw new Error(err.message, { cause: err.cause });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
