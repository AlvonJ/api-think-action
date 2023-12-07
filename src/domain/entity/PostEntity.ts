export interface PostInterface {
  id?: string;
  userId?: string;
  categoryResolutionId?: string;
  type?: 'resolutions' | 'weeklyGoals' | 'completeGoals';
  caption?: string;
  photo?: Array<string>;
  like?: Array<string> | string;
  dueDate?: Date | string;
  updatedDate?: Date | string;
  shareWith?: 'everyone' | 'supporter' | 'private';
  weeklyGoalId?: string;
  isComplete?: boolean;
  isUpdating?: boolean;
}

export class PostEntity {
  id?: string;
  userId: string;
  categoryResolutionId: string;
  type: 'resolutions' | 'weeklyGoals' | 'completeGoals';
  caption: string;
  photo?: Array<string>;
  like?: Array<string> | string;
  dueDate?: Date | string;
  updatedDate?: Date | string;
  shareWith: 'everyone' | 'supporter' | 'private';
  weeklyGoalId?: string;
  isComplete?: boolean;
  isUpdating: boolean;

  constructor(post: PostInterface) {
    this.id = post.id;
    this.userId = post.userId;
    this.categoryResolutionId = post.categoryResolutionId;
    this.type = post.type;
    this.caption = post.caption;
    this.photo = post.photo;
    this.like = post.like;
    this.dueDate = post.dueDate;
    this.updatedDate = post.updatedDate;
    this.shareWith = post.shareWith;
    this.weeklyGoalId = post.weeklyGoalId;
    this.isComplete = post.isComplete;
    this.isUpdating = post.isUpdating || false;
  }

  validate() {
    this.validateUserId();
    this.validateCategoryResolutionId();
    this.validateType();
    this.validateCaption();
    this.validatePhoto();
    this.validateLike();
    this.validateDueDate();
    this.validateUpdatedDate();
    this.validateShareWith();
    this.validateWeeklyGoalId();
    this.validateIsComplete();
  }

  private validateUserId() {
    if (this.isUpdating && !this.userId) return;

    if (!this.userId || typeof this.userId !== 'string' || this.userId.trim() === '') {
      throw new Error('Invalid User ID. User ID must be a non-empty string.', { cause: 'ValidationError' });
    }
  }

  private validateCategoryResolutionId() {
    if (this.isUpdating && !this.categoryResolutionId) return;

    if (
      !this.categoryResolutionId ||
      typeof this.categoryResolutionId !== 'string' ||
      this.categoryResolutionId.trim() === ''
    ) {
      throw new Error('Invalid Category Resolution ID. Category Resolution ID must be a non-empty string.', {
        cause: 'ValidationError',
      });
    }
  }

  private validateType() {
    if (this.isUpdating && !this.type) return;

    if (!['resolutions', 'weeklygoals', 'completegoals'].includes(this.type.toLowerCase())) {
      throw new Error('Invalid Type. Type must be one of "resolutions", "weeklyGoals", "completeGoals".', {
        cause: 'ValidationError',
      });
    }
  }

  private validateCaption() {
    if (this.isUpdating && !this.caption) return;

    if (!this.caption || typeof this.caption !== 'string' || this.caption.trim() === '') {
      throw new Error('Invalid Caption. Caption must be a non-empty string.', { cause: 'ValidationError' });
    }
  }

  private validatePhoto() {
    if (this.photo && (!Array.isArray(this.photo) || this.photo.some(item => typeof item !== 'string'))) {
      throw new Error('Invalid Photo. Photo must be an array of strings.', { cause: 'ValidationError' });
    }
  }

  private validateLike() {
    if (
      this.like &&
      !(
        (Array.isArray(this.like) && !this.like.some(item => typeof item !== 'string')) ||
        typeof this.like === 'string'
      )
    ) {
      throw new Error('Invalid Like. Like must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateDueDate() {
    if (!this.dueDate && (this.type.toLowerCase() === 'resolutions' || this.type.toLowerCase() === 'weeklygoals')) {
      throw new Error('Invalid Due Date. Due Date is required for Resolutions and Weekly Goals.', {
        cause: 'ValidationError',
      });
    }

    if (this.dueDate && !(this.dueDate instanceof Date || /^\d{4}-\d{2}-\d{2}$/.test(this.dueDate))) {
      throw new Error('Invalid Due Date. Due Date must be a valid Date object or in the format string "YYYY-MM-DD"', {
        cause: 'ValidationError',
      });
    }
  }

  private validateUpdatedDate() {
    if (this.isUpdating && (this.dueDate || this.caption || this.categoryResolutionId)) this.updatedDate = new Date();
  }

  private validateShareWith() {
    if (this.isUpdating && !this.shareWith) return;

    if (!['everyone', 'supporter', 'private'].includes(this.shareWith.toLowerCase())) {
      throw new Error('Invalid Share With. Share With must be one of "everyone", "supporter", "private".', {
        cause: 'ValidationError',
      });
    }
  }

  private validateWeeklyGoalId() {
    if (this.type.toLowerCase() === 'completegoals' && (!this.weeklyGoalId || typeof this.weeklyGoalId !== 'string')) {
      throw new Error('Invalid Weekly Goal ID. Weekly Goal ID is required for complete goals and must be a string.', {
        cause: 'ValidationError',
      });
    }
  }

  private validateIsComplete() {
    if (this.isComplete && typeof this.isComplete !== 'boolean') {
      throw new Error('Invalid Is Complete. Is Complete must be a boolean value.', { cause: 'ValidationError' });
    }
  }
}
