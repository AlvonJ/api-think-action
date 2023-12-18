import { UserEntity } from '../../entity/UserEntity.js';

export async function getCurrentUserNotificationInteractor(
  getCurrentUserNotificationPersistence: (authUserId: string) => Promise<any>,
  authUserId: string
): Promise<Array<any>> {
  const data = await getCurrentUserNotificationPersistence(authUserId);

  // Check if notification object is empty
  if (Object.keys(data).length === 0) {
    throw new Error('No notification found', { cause: 'DataNotFound' });
  }

  return data;
}
