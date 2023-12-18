import { UserEntity } from '../../entity/UserEntity.js';

export async function getCurrentHistoryAccountInteractor(
  getCurrentHistoryAccountPersistence: (authUserId: string) => Promise<any>,
  authUserId: string
): Promise<Array<UserEntity>> {
  const data = await getCurrentHistoryAccountPersistence(authUserId);

  if (data.length === 0) {
    throw new Error('No history account found', { cause: 'DataNotFound' });
  }

  return data;
}
