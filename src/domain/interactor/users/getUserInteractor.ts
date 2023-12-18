import { UserEntity } from '../../entity/UserEntity.js';

export async function getUserInteractor(
  getUserPersistence: (id: string) => Promise<any>,
  id: string
): Promise<UserEntity> {
  const user = await getUserPersistence(id);

  return user;
}
