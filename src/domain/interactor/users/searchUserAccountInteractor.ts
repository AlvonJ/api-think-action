import { UserEntity } from '../../entity/UserEntity.js';

export async function searchUserAccountInteractor(
  searchUserAccountPersistence: (authUserId: string, username: String) => Promise<any>,
  { authUserId, username }: { authUserId: string; username: string }
): Promise<Array<UserEntity>> {
  if (!username) {
    throw new Error('Username is required!', { cause: 'ValidationError' });
  }

  const updatedUser = await searchUserAccountPersistence(authUserId, username);

  return updatedUser;
}
