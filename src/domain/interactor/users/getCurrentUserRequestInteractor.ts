import { UserEntity } from '../../entity/UserEntity.js';

export async function getCurrentUserRequestInteractor(
  getCurrentUserRequestPersistence: (authUserId: string, limit: number, page: number) => Promise<any>,
  { authUserId, limit, page }: { authUserId: string; limit: number; page: number }
): Promise<Array<UserEntity>> {
  const data = await getCurrentUserRequestPersistence(authUserId, limit, page);

  if (data.length === 0) {
    throw new Error('No request found', { cause: 'DataNotFound' });
  }

  return data;
}
