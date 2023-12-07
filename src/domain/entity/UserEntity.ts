interface CategoryResolutionInterface {
  id?: string;
  name?: string;
  resolution?: string;
  isComplete?: boolean;
  createdDate?: Date;
}

export interface UserInterface {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  fullname?: string;
  bio?: string;
  photo?: string;
  supporter?: Array<string> | string;
  supporting?: Array<string> | string;
  request?: Array<string> | string;
  notification?: Array<string> | string;
  categoryResolution?: Array<CategoryResolutionInterface>;
  historyAccount?: Array<string>;
  isPublic?: boolean;
  isUpdating?: boolean;
}

export class UserEntity {
  id?: string;
  username: string;
  email: string;
  password: string;
  fullname?: string;
  bio?: string;
  photo?: string;
  supporter?: Array<string> | string;
  supporting?: Array<string> | string;
  request?: Array<string> | string;
  notification?: Array<string> | string;
  categoryResolution?: Array<CategoryResolutionInterface>;
  historyAccount?: Array<string>;
  isPublic?: boolean;
  isUpdating?: boolean;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.fullname = user.fullname;
    this.bio = user.bio;
    this.photo = user.photo;
    this.supporter = user.supporter;
    this.supporting = user.supporting;
    this.request = user.request;
    this.notification = user.notification;
    this.historyAccount = user.historyAccount;
    this.categoryResolution = user.categoryResolution;
    this.isPublic = user.isPublic || true;
    this.isUpdating = user.isUpdating || false;
  }

  validate() {
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateFullname();
    this.validateBio();
    this.validateSupporter();
    this.validateSupporting();
    this.validateRequest();
    this.validateNotification();
    this.validateCategoryResolution();
    this.validateHistoryAccount();
  }

  private validateUsername() {
    // If updating and username is null, return
    if (this.isUpdating && !this.username) return;

    // If username is null
    if (!this.username || typeof this.username !== 'string' || this.username.trim() === '') {
      throw new Error('Invalid Username. Username must be a non-empty string.', { cause: 'ValidationError' });
    }

    // Check special characters
    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.username)) {
      throw new Error('Invalid Username. Username cannot contains special characters!', {
        cause: 'ValidationError',
      });
    }
  }

  private validateEmail() {
    // If updating and email is null, return
    if (this.isUpdating && !this.email) return;

    // If email is null
    if (!this.email || typeof this.email !== 'string' || this.email.trim() === '') {
      throw new Error('Invalid Email. Email field must be non-empty string', { cause: 'ValidationError' });
    }

    // If email is invalid
    if (!this.email.includes('@')) {
      throw new Error('Invalid Email. Email must be valid', {
        cause: 'ValidationError',
      });
    }
  }

  private validatePassword() {
    // If updating and password is null, return
    if (this.isUpdating && !this.password) return;

    // If password is null
    if (!this.password || typeof this.password !== 'string' || this.password.trim() === '') {
      throw new Error('Invalid Password. Password field must be non-empty string', { cause: 'ValidationError' });
    }
  }

  private validateFullname() {
    if (this.fullname && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.fullname)) {
      throw new Error('Invalid Fullname. Fullname cannot contains special characters!', {
        cause: 'ValidationError',
      });
    }
  }

  private validateBio() {
    if (this.bio && (typeof this.bio !== 'string' || this.bio.length > 255)) {
      throw new Error('Invalid Bio. Bio must be string and lower than 256 characters!', {
        cause: 'ValidationError',
      });
    }
  }

  private validateSupporter() {
    if (!this.supporter) return;

    if (
      !(
        (Array.isArray(this.supporter) && !this.supporter.some(item => typeof item !== 'string')) ||
        typeof this.supporter === 'string'
      )
    ) {
      throw new Error('Invalid Supporter. Supporter must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateSupporting() {
    if (!this.supporting) return;

    if (
      !(
        (Array.isArray(this.supporting) && !this.supporting.some(item => typeof item !== 'string')) ||
        typeof this.supporting === 'string'
      )
    ) {
      throw new Error('Invalid Supporting. Supporting must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateRequest() {
    if (!this.request) return;

    if (
      !(
        (Array.isArray(this.request) && !this.request.some(item => typeof item !== 'string')) ||
        typeof this.request === 'string'
      )
    ) {
      throw new Error('Invalid Request. Request must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateNotification() {
    if (!this.notification) return;

    if (
      !(
        (Array.isArray(this.notification) && !this.notification.some(item => typeof item !== 'string')) ||
        typeof this.notification === 'string'
      )
    ) {
      throw new Error('Invalid Notification. Notification must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateHistoryAccount() {
    if (!this.historyAccount) return;

    if (
      !(
        (Array.isArray(this.historyAccount) && !this.historyAccount.some(item => typeof item !== 'string')) ||
        typeof this.notification === 'string'
      )
    ) {
      throw new Error('Invalid History Account. History Account must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateCategoryResolution() {
    if (!this.categoryResolution) return;

    // Add validation for each category resolution object
    this.categoryResolution.forEach(resolution => {
      if (resolution.name && (typeof resolution.name !== 'string' || resolution.name.trim() === '')) {
        throw new Error('Invalid Category Resolution Name. Name must be a non-empty string.', {
          cause: 'ValidationError',
        });
      }

      if (resolution.resolution && (typeof resolution.resolution !== 'string' || resolution.resolution.trim() === '')) {
        throw new Error('Invalid Resolution. Resolution must be a non-empty string.', {
          cause: 'ValidationError',
        });
      }

      if (resolution.isComplete && typeof resolution.isComplete !== 'boolean') {
        throw new Error('Invalid Category Resolution isComplete. isComplete must be a boolean.', {
          cause: 'ValidationError',
        });
      }

      if (resolution.createdDate && !(resolution.createdDate instanceof Date)) {
        throw new Error('Invalid Category Resolution cratedDate. createdDate must be a Date.', {
          cause: 'ValidationError',
        });
      }
    });
  }
}
