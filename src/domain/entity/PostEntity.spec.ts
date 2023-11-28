import { PostEntity } from './PostEntity';

describe('PostEntity', () => {
  let postObject;

  beforeEach(() => {
    postObject = {
      id: '1',
      userId: '2',
      categoryResolutionId: '3',
      type: 'resolutions',
      caption: 'test caption',
      photo: ['photo1.jpg, photo2.jpg'],
      likeCount: 2,
      commentCount: 3,
      like: ['23, 24'],
      dueDate: '2023-11-19',
      shareWith: 'everyone',
    };
  });

  it('should create a PostEntity instance with valid data', () => {
    const postEntity = new PostEntity(postObject);

    postEntity.validate();

    expect(postEntity).toBeDefined();

    expect(postEntity.id).toBe(postObject.id);
    expect(postEntity.userId).toBe(postObject.userId);
    expect(postEntity.categoryResolutionId).toBe(postObject.categoryResolutionId);
    expect(postEntity.type).toBe(postObject.type);
    expect(postEntity.caption).toBe(postObject.caption);
    expect(postEntity.photo).toBe(postObject.photo);
    expect(postEntity.likeCount).toBe(postObject.likeCount);
    expect(postEntity.commentCount).toBe(postObject.commentCount);
    expect(postEntity.like).toBe(postObject.like);
    expect(postEntity.dueDate).toBe(postObject.dueDate);
    expect(postEntity.updatedDate).toBeUndefined();
    expect(postEntity.shareWith).toBe(postObject.shareWith);
    expect(postEntity.isUpdating).toBe(false);
  });

  it('should thrown an error if PostEntity user ID is invalid', () => {
    const postEntity = new PostEntity(postObject);

    postEntity.userId = undefined;
    expect(() => postEntity.validate()).toThrow();

    postEntity.userId = '';
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity category resolution ID is invalid', () => {
    const postEntity = new PostEntity(postObject);

    postEntity.categoryResolutionId = undefined;
    expect(() => postEntity.validate()).toThrow();

    postEntity.categoryResolutionId = '';
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity type is invalid', () => {
    postObject.type = 'test';
    const postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postEntity.type = undefined;
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity caption is invalid', () => {
    const postEntity = new PostEntity(postObject);

    postEntity.caption = undefined;
    expect(() => postEntity.validate()).toThrow();

    postEntity.caption = '';
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity photo is invalid', () => {
    postObject.photo = [12345];
    let postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.photo = 45;
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity like count is invalid', () => {
    postObject.likeCount = 'asd';
    let postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.likeCount = -5;
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity comment count is invalid', () => {
    postObject.commentCount = 'asd';
    let postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.commentCount = -5;
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity like is invalid', () => {
    postObject.like = 123;
    let postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.like = [123];
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity due date is invalid', () => {
    postObject.dueDate = undefined;
    let postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.dueDate = 12345;
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.type = 'completeGoals';
    postObject.dueDate = undefined;
    postObject.weeklyGoalId = '12';
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).not.toThrow();
  });

  it('should thrown an error if PostEntity share with is invalid', () => {
    postObject.shareWith = 'test';
    const postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity weekly goal ID is invalid', () => {
    postObject.weeklyGoalId = undefined;
    let postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).not.toThrow();

    postObject.type = 'completeGoals';
    postObject.weeklyGoalId = undefined;
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();

    postObject.weeklyGoalId = 12345;
    postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should thrown an error if PostEntity isComplete is invalid', () => {
    postObject.isComplete = 'test';
    const postEntity = new PostEntity(postObject);
    expect(() => postEntity.validate()).toThrow();
  });

  it('should create updated date if updating', () => {
    postObject.isUpdating = true;
    postObject.caption = 'New Caption';
    const postEntity = new PostEntity(postObject);

    postEntity.validate();

    expect(postEntity.updatedDate).toBeDefined();
  });
});
