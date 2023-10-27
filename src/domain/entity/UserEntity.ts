export interface UserInterface {
  id?: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  photo?: string;
  role?: string;
  isUpdating?: boolean;
}

export class UserEntity {
  id?: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  photo?: string;
  role?: string;
  isUpdating: boolean;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
    this.phone = user.phone;
    this.photo = user.photo;
    this.role = user.role || 'user';
    this.isUpdating = user.isUpdating || false;
  }

  validate() {
    this.validateEmail();
    this.validateUsername();
    this.validatePassword();
    this.validatePhone();
  }

  private validateEmail() {
    // If updating and email is null, return
    if (this.isUpdating && !this.email) return;

    // If email is null
    if (!this.email)
      throw new Error('Invalid Email. Email field must be non-empty string', { cause: 'ValidationError' });

    // If email is invalid
    if (!this.email.includes('@'))
      throw new Error('Email must be valid!', {
        cause: 'ValidationError',
      });
  }

  private validateUsername() {
    // If updating and username is null, return
    if (this.isUpdating && !this.username) return;

    // If username is null
    if (!this.username)
      throw new Error('Invalid Username. Username field must be non-empty string', { cause: 'ValidationError' });

    // Check special characters
    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.username))
      throw new Error('Invalid Username. Username cannot contains special characters!', {
        cause: 'ValidationError',
      });
  }

  private validatePassword() {
    // If updating and password is null, return
    if (this.isUpdating && !this.password) return;

    // If password is null
    if (!this.password)
      throw new Error('Invalid Password. Password field must be non-empty string', { cause: 'ValidationError' });
  }

  private validatePhone() {
    // If updating and phone is null, return
    if (this.isUpdating && !this.phone) return;

    // If Phone is null
    if (!this.phone)
      throw new Error('Invalid Phone. Phone field must be non-empty string', { cause: 'ValidationError' });

    // Check only numbers
    if (!/^[0-9]+$/.test(this.phone))
      throw new Error('Invalid Phone. Phone number must not contains alphabet!', {
        cause: 'ValidationError',
      });
  }
}
