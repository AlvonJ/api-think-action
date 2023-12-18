import { UserEntity } from '../../entity/UserEntity.js';

export async function getOneUserInteractor(
  getOneUserPersistence: (authUserId: string, userId: string) => Promise<any>,
  { authUserId, userId }: { authUserId: string; userId: string }
): Promise<UserEntity> {
  const user = await getOneUserPersistence(authUserId, userId);

  if (!user) {
    throw new Error('No users found with that id!', { cause: 'DataNotFound' });
  }

  return user;
}
