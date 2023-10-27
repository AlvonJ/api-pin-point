interface InvitationInterface {
  user: string;
  status: string;
  message?: string;
}

export interface GroupInterface {
  id?: string;
  name: string;
  admin: string;
  tagLocation?: Array<string>;
  member?: Array<string>;
  invitations?: Array<InvitationInterface>;
  isUpdating?: boolean;
}

export class GroupEntity {
  id?: string;
  name: string;
  admin: string;
  tagLocation: Array<string>;
  member: Array<string>;
  invitations?: Array<InvitationInterface>;
  isUpdating?: boolean;

  constructor(group: GroupInterface) {
    this.id = group.id;
    this.name = group.name;
    this.admin = group.admin;
    this.tagLocation = group.tagLocation || [];
    this.member = group.member || [];
    this.invitations = group.invitations || [];
    this.isUpdating = group.isUpdating || false;
  }

  validate() {
    this.validateName();
    this.validateMember();
    this.validateAdmin();
    this.validateTagLocation();
    this.validateInvitations();
  }

  private validateName() {
    // If updating and name is null, return
    if (this.isUpdating && !this.name) return;

    // If name is null
    if (!this.name || typeof this.name !== 'string')
      throw new Error('Invalid Name. Name must be non-empty string', { cause: 'ValidationError' });
  }

  private validateMember() {
    // If updating and member is null return
    if (this.isUpdating && !this.member) return;

    // If member contains not string
    if (this.member.some(memberItem => typeof memberItem !== 'string'))
      throw new Error('Invalid member. Member field must be array of strings', {
        cause: 'ValidationError',
      });
  }

  private validateAdmin() {
    // If updating and admin is null return
    if (this.isUpdating && !this.admin) return;

    // If member contains not string
    if (!this.admin || typeof this.admin !== 'string')
      throw new Error('Invalid Admin. Admin must be string of user ID', { cause: 'ValidationError' });
  }

  private validateTagLocation() {
    // If updating and tagLocation is null return
    if (this.isUpdating && !this.tagLocation) return;

    // If tagLocation contains not string
    if (this.tagLocation.some(item => typeof item !== 'string'))
      throw new Error('Invalid tagLocation. TagLocation field must be array of strings', {
        cause: 'ValidationError',
      });
  }

  private validateInvitations() {
    // If updating and invitations is null return
    if (this.isUpdating && !this.invitations) return;

    // If invitations is not an array
    if (!Array.isArray(this.invitations)) {
      throw new Error('Invalid Invitations. Invitations field must be an array of valid invitation objects', {
        cause: 'ValidationError',
      });
    }

    // Check each invitations
    for (const invitation of this.invitations) {
      if (
        !invitation ||
        typeof invitation !== 'object' ||
        typeof invitation.user !== 'string' ||
        !['accepted', 'rejected', 'pending'].includes(invitation.status) ||
        (invitation.message && (typeof invitation.message !== 'string' || Object.keys(invitation).length !== 3)) ||
        (!invitation.message && Object.keys(invitation).length !== 2)
      ) {
        throw new Error(
          'Invalid Invitation structure. Each invitation must have a "user" (string), "status" ("accepted", "rejected", or "pending"), and "message" (optional string)',
          {
            cause: 'ValidationError',
          }
        );
      }
    }
  }
}
