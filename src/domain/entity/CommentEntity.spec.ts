import { CommentEntity } from './CommentEntity';

describe('CommentEntity', () => {
  let commentObject;

  beforeEach(() => {
    commentObject = {
      id: '1',
      userId: '2',
      postId: '3',
      message: 'This is comment',
      type: 'comment',
      reply: ['123'],
    };
  });

  it('should create a CommentEntity instance with valid data', () => {
    const commentEntity = new CommentEntity(commentObject);

    commentEntity.validate();

    expect(commentEntity).toBeDefined();

    expect(commentEntity.id).toBe(commentObject.id);
    expect(commentEntity.userId).toBe(commentObject.userId);
    expect(commentEntity.postId).toBe(commentObject.postId);
    expect(commentEntity.message).toBe(commentObject.message);
    expect(commentEntity.reply).toBe(commentObject.reply);
    expect(commentEntity.createdDate).toBeDefined();
    expect(commentEntity.updatedDate).toBeUndefined();
  });

  it('should thrown an error if CommentEntity userId is invalid', () => {
    commentObject.userId = null;
    let commentEntity = new CommentEntity(commentObject);
    expect(() => commentEntity.validate()).toThrow();

    commentObject.userId = '';
    commentEntity = new CommentEntity(commentObject);
    expect(() => commentObject.validate()).toThrow();
  });

  it('should thrown an error if CommentEntity postId is invalid', () => {
    commentObject.postId = null;
    let commentEntity = new CommentEntity(commentObject);
    expect(() => commentEntity.validate()).toThrow();

    commentObject.postId = '';
    commentEntity = new CommentEntity(commentObject);
    expect(() => commentObject.validate()).toThrow();
  });

  it('should thrown an error if CommentEntity message is invalid', () => {
    commentObject.message = null;
    let commentEntity = new CommentEntity(commentObject);
    expect(() => commentEntity.validate()).toThrow();

    commentObject.message = '';
    commentEntity = new CommentEntity(commentObject);
    expect(() => commentObject.validate()).toThrow();
  });

  it('should thrown an error if CommentEntity type is invalid', () => {
    commentObject.type = 'hehehe';
    let commentEntity = new CommentEntity(commentObject);
    expect(() => commentEntity.validate()).toThrow();

    commentObject.type = '';
    commentEntity = new CommentEntity(commentObject);
    expect(() => commentObject.validate()).toThrow();
  });

  it('should thrown an error if CommentEntity reply is invalid', () => {
    commentObject.reply = [true, 12345];
    let commentEntity = new CommentEntity(commentObject);
    expect(() => commentEntity.validate()).toThrow();

    commentObject.reply = 5123213;
    commentEntity = new CommentEntity(commentObject);
    expect(() => commentObject.validate()).toThrow();
  });

  it('should create updated date if CommentEntity is updating message', () => {
    commentObject.isUpdating = true;
    commentObject.message = 'Updated message';
    let commentEntity = new CommentEntity(commentObject);
    commentEntity.validate();
    expect(commentEntity.updatedDate).toBeDefined();
  });
});
