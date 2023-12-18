import { UserEntity } from '../../entity/UserEntity.js';

export async function getAllSupporterInteractor(
  getAllSupporterPersistence: (authUserId: string, userId: String, limit: number, page: number) => Promise<any>,
  { authUserId, userId, limit, page }: { authUserId: string; userId: string; limit: number; page: number }
): Promise<Array<UserEntity>> {
  if (!userId) {
    throw new Error('userId is required!', { cause: 'ValidationError' });
  }

  const user = await getAllSupporterPersistence(authUserId, userId, limit, page);

  if (user.length === 0) {
    throw new Error('No supporter found', { cause: 'DataNotFound' });
  }

  return user;
}
