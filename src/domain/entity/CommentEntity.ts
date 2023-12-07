export interface CommentInterface {
  id?: string;
  userId?: string;
  postId?: string;
  message?: string;
  reply?: Array<string> | string;
  type?: 'comment' | 'reply';
  updatedDate?: Date;
  isUpdating?: boolean;
}

export class CommentEntity {
  id?: string;
  userId: string;
  postId: string;
  message: string;
  reply?: Array<string> | string;
  type?: 'comment' | 'reply';
  updatedDate?: Date;
  createdDate?: Date;
  isUpdating: boolean;

  constructor(comment: CommentInterface) {
    this.id = comment.id;
    this.userId = comment.userId;
    this.postId = comment.postId;
    this.message = comment.message;
    this.reply = comment.reply;
    this.type = comment.type;
    this.updatedDate = comment.updatedDate;
    this.createdDate = new Date();
    this.isUpdating = comment.isUpdating || false;
  }

  validate() {
    this.validateUserId();
    this.validatePostId();
    this.validateMessage();
    this.validateReply();
    this.validateType();
    this.validateUpdatedDate();
    this.validateCreatedDate();
  }

  private validateUserId() {
    if (this.isUpdating && !this.userId) return;

    if (!this.userId || typeof this.userId !== 'string' || this.userId.trim() === '')
      throw new Error('Invalid User ID. User ID field must be non-empty string', { cause: 'ValidationError' });
  }

  private validatePostId() {
    if (this.isUpdating && !this.postId) return;

    if (!this.postId || typeof this.postId !== 'string' || this.postId.trim() === '')
      throw new Error('Invalid Post ID. Post ID field must be non-empty string', { cause: 'ValidationError' });
  }

  private validateMessage() {
    if (this.isUpdating && !this.message) return;

    if (!this.message || typeof this.message !== 'string' || this.message.trim() === '')
      throw new Error('Invalid Message. Message field must be non-empty string', { cause: 'ValidationError' });
  }

  private validateType() {
    if (this.type && !(this.type.toLowerCase() === 'comment' || this.type.toLowerCase() === 'reply')) {
      throw new Error('Invalid Type. Type must be comment or reply', {
        cause: 'ValidationError',
      });
    }
  }
  private validateReply() {
    if (!this.reply) return;

    if (
      !(
        (Array.isArray(this.reply) && !this.reply.some(item => typeof item !== 'string')) ||
        typeof this.reply === 'string'
      )
    ) {
      throw new Error('Invalid Reply. Reply must be an array of strings or string', {
        cause: 'ValidationError',
      });
    }
  }

  private validateUpdatedDate() {
    if (this.isUpdating && this.message) this.updatedDate = new Date();

    if (this.updatedDate && !(this.updatedDate instanceof Date)) {
      throw new Error('Invalid Updated Date. Updated Date must be Date', {
        cause: 'ValidationError',
      });
    }
  }

  private validateCreatedDate() {
    if (this.createdDate && !(this.createdDate instanceof Date)) {
      throw new Error('Invalid Created Date. Created Date must be Date', {
        cause: 'ValidationError',
      });
    }
  }
}
