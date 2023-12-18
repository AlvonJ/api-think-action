import { UserEntity } from '../../entity/UserEntity.js';

export async function getUserByEmailInteractor(
  getUserByEmailPersistence: (email: string) => Promise<any>,
  email: string
): Promise<UserEntity> {
  const user = await getUserByEmailPersistence(email);

  return user;
}
