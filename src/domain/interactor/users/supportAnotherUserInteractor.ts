import { UserEntity } from '../../entity/UserEntity.js';

export async function supportAnotherUserInteractor(
  supportAnotherUserPersistence: (authUserId: string, userId: String) => Promise<any>,
  { authUserId, userId }: { authUserId: string; userId: string }
): Promise<UserEntity> {
  if (!userId) {
    throw new Error('userId is required!', { cause: 'ValidationError' });
  }

  if (authUserId == userId) {
    throw new Error('You cannot support yourself!', { cause: 'ValidationError' });
  }

  const updatedUser = await supportAnotherUserPersistence(authUserId, userId);

  return updatedUser;
}
