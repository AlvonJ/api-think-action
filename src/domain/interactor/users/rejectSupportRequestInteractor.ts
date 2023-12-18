import { UserEntity } from '../../entity/UserEntity.js';

export async function rejectSupportRequestInteractor(
  rejectSupportRequestPersistence: (authUserId: string, userId: String) => Promise<any>,
  { authUserId, userId }: { authUserId: string; userId: string }
): Promise<UserEntity> {
  if (!userId) {
    throw new Error('userId is required!', { cause: 'ValidationError' });
  }

  if (authUserId == userId) {
    throw new Error('You cannot reject support request for yourself!', { cause: 'ValidationError' });
  }
  const user = await rejectSupportRequestPersistence(authUserId, userId);

  return user;
}
