import { UserEntity } from '../../entity/UserEntity.js';

export async function unsupportAnotherUserInteractor(
  unsupportAnotherUserPersistence: (authUserId: string, userId: String) => Promise<any>,
  { authUserId, userId }: { authUserId: string; userId: string }
): Promise<UserEntity> {
  if (!userId) {
    throw new Error('userId is required!', { cause: 'ValidationError' });
  }

  if (authUserId == userId) {
    throw new Error('You cannot unsupport yourself!', { cause: 'ValidationError' });
  }

  const updatedUser = await unsupportAnotherUserPersistence(authUserId, userId);

  return updatedUser;
}
