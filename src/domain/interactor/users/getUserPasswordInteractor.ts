import { UserEntity } from '../../entity/UserEntity.js';

export async function getUserPasswordInteractor(
  getUserPasswordPersistence: (id: string) => Promise<any>,
  id: string
): Promise<UserEntity> {
  const user = await getUserPasswordPersistence(id);

  return user;
}
