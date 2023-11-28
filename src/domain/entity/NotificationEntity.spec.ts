import { NotificationEntity } from './NotificationEntity';

describe('NotificationEntity', () => {
  let notificationObject;

  beforeEach(() => {
    notificationObject = {
      id: '1',
      type: 'message',
      message: 'This is notification message',
    };
  });

  it('should create a NotificationEntity instance with valid data', () => {
    const notificationEntity = new NotificationEntity(notificationObject);

    notificationEntity.validate();

    expect(notificationEntity).toBeDefined();

    expect(notificationEntity.id).toBe(notificationObject.id);
    expect(notificationEntity.type).toBe(notificationObject.type);
    expect(notificationEntity.message).toBe(notificationObject.message);
    expect(notificationEntity.status).toBeUndefined();
    expect(notificationEntity.date).toBeDefined();
  });

  it('should thrown an error if NotificationEntity type is invalid', () => {
    notificationObject.type = 'test';
    let notificationEntity = new NotificationEntity(notificationObject);
    expect(() => notificationEntity.validate()).toThrow();

    notificationObject.type = null;
    notificationEntity = new NotificationEntity(notificationObject);
    expect(() => notificationObject.validate()).toThrow();
  });

  it('should thrown an error if NotificationEntity message is invalid', () => {
    notificationObject.message = null;
    let notificationEntity = new NotificationEntity(notificationObject);
    expect(() => notificationEntity.validate()).toThrow();

    notificationObject.message = '';
    notificationEntity = new NotificationEntity(notificationObject);
    expect(() => notificationObject.validate()).toThrow();
  });

  it('should thrown an error if NotificationEntity status is invalid', () => {
    notificationObject.type = 'request';
    notificationObject.status = undefined;

    let notificationEntity = new NotificationEntity(notificationObject);
    expect(() => notificationEntity.validate()).toThrow();

    notificationObject.status = 'test';
    notificationEntity = new NotificationEntity(notificationObject);
    expect(() => notificationObject.validate()).toThrow();
  });
});
