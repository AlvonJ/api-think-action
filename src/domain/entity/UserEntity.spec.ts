import { UserEntity } from './UserEntity';

describe('UserEntity', () => {
  let userObject;

  beforeEach(() => {
    userObject = {
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
      fullname: 'Test User',
      bio: 'This is a test user',
      photo: 'photo.jpg',
      supporterCount: 10,
      supportingCount: 5,
      notificationCount: 0,
      supporter: ['2', '3'],
      supporting: ['4', '5'],
      notification: ['6', '7'],
      categoryResolution: [{ id: '1', name: 'Test', resolution: 'Test Resolution', isComplete: false }],
      isPublic: true,
      isUpdating: false,
    };
  });

  it('should create a UserEntity instance with valid data', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.validate();
    expect(userEntity).toBeDefined();

    expect(userEntity.id).toBe(userObject.id);
    expect(userEntity.username).toBe(userObject.username);
    expect(userEntity.email).toBe(userObject.email);
    expect(userEntity.password).toBe(userObject.password);
    expect(userEntity.fullname).toBe(userObject.fullname);
    expect(userEntity.bio).toBe(userObject.bio);
    expect(userEntity.photo).toBe(userObject.photo);
    expect(userEntity.supporterCount).toBe(userObject.supporterCount);
    expect(userEntity.supportingCount).toBe(userObject.supportingCount);
    expect(userEntity.notificationCount).toBe(userObject.notificationCount);
    expect(userEntity.supporter).toBe(userObject.supporter);
    expect(userEntity.supporting).toBe(userObject.supporting);
    expect(userEntity.notification).toBe(userObject.notification);
    expect(userEntity.categoryResolution).toBe(userObject.categoryResolution);
    expect(userEntity.isPublic).toBe(userObject.isPublic);
    expect(userEntity.isUpdating).toBe(userObject.isUpdating);
  });

  it('should thrown an error if UserEntity username is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.username = undefined;
    expect(() => userEntity.validate()).toThrow();

    userEntity.username = '';
    expect(() => userEntity.validate()).toThrow();

    userEntity.username = '@asd/';
    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity email is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.email = undefined;
    expect(() => userEntity.validate()).toThrow();

    userEntity.email = '';
    expect(() => userEntity.validate()).toThrow();

    userEntity.email = 'emailcom';
    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity password is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.password = undefined;
    expect(() => userEntity.validate()).toThrow();

    userEntity.password = '';
    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity fullname is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.fullname = '@asd/wqewqe';
    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity bio is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.bio =
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity supporter count is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.supporterCount = -5;

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity supporting count is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.supportingCount = -3;

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity notification count is invalid', () => {
    const userEntity = new UserEntity(userObject);

    userEntity.notificationCount = -3;

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity supporter is invalid', () => {
    userObject.supporter = 123;

    const userEntity = new UserEntity(userObject);

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity supporting is invalid', () => {
    userObject.supporting = [123];

    const userEntity = new UserEntity(userObject);

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity notification is invalid', () => {
    userObject.notification = true;

    const userEntity = new UserEntity(userObject);

    expect(() => userEntity.validate()).toThrow();
  });

  it('should thrown an error if UserEntity category resolution is invalid', () => {
    userObject.categoryResolution = [{ id: 1, name: true, resolution: 'Test Resolution', isComplete: false }];
    let userEntity = new UserEntity(userObject);
    expect(() => userEntity.validate()).toThrow();

    userObject.categoryResolution = [{ id: 1, name: 'Test', resolution: 123, isComplete: false }];
    userEntity = new UserEntity(userObject);
    expect(() => userEntity.validate()).toThrow();

    userObject.categoryResolution = [{ id: 1, name: 'Test', resolution: 'Test Resolution', isComplete: 'test' }];
    userEntity = new UserEntity(userObject);
    expect(() => userEntity.validate()).toThrow();
  });
});
