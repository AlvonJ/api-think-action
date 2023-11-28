export interface NotificationInterface {
  id?: string;
  type?: 'request' | 'message';
  message?: string;
  status?: 'accepted' | 'rejected' | 'pending';
  date?: Date;
}

export class NotificationEntity {
  id?: string;
  type: 'request' | 'message';
  message: string;
  status?: 'accepted' | 'rejected' | 'pending';
  date: Date;

  constructor(notification: NotificationInterface) {
    this.id = notification.id;
    this.type = notification.type;
    this.message = notification.message;
    this.status = notification.status;
    this.date = notification.date || new Date();
  }

  validate() {
    this.validateType();
    this.validateMessage();
    this.validateStatus();
    this.validateDate();
  }

  private validateType() {
    if (!this.type || !['request', 'message'].includes(this.type)) {
      throw new Error('Invalid Type. Type must be "request" or "message".', {
        cause: 'ValidationError',
      });
    }
  }

  private validateMessage() {
    if (!this.message || typeof this.message !== 'string' || this.message.trim() === '') {
      throw new Error('Invalid message. Mesage must be a non-empty string.', { cause: 'ValidationError' });
    }
  }

  private validateStatus() {
    if (this.type === 'request' && (!this.status || !['accepted', 'rejected', 'pending'].includes(this.status))) {
      throw new Error('Invalid Status. Status must be "accepted", "rejected", "pending".', {
        cause: 'ValidationError',
      });
    }
  }

  private validateDate() {
    if (this.date && !(this.date instanceof Date)) {
      throw new Error('Invalid Date. Date must be a valid Date object.', { cause: 'ValidationError' });
    }
  }
}
