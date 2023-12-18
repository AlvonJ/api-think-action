import bcrypt from 'bcrypt';
import { UserEntity, UserInterface } from '../../entity/UserEntity.js';

export async function createUserInteractor(
  createUserPersistence: (user: UserInterface) => Promise<any>,
  user: UserInterface
): Promise<UserInterface> {
  const userObject = new UserEntity(user);

  userObject.validate();

  const validatedUser = {
    ...user,
    password: await bcrypt.hash(user.password, 10),
    email: user.email.toLowerCase(),
    fullname: user.fullname ?? null,
    bio: user.bio ?? null,
    photo: user.photo ?? null,
    supporter: [],
    supporting: [],
    request: [],
    notification: [],
    supporterCount: 0,
    supportingCount: 0,
    requestCount: 0,
    notificationCount: 0,
    categoryResolution: [],
    historyAccount: [],
    isPublic: true,
  };

  const newUser = await createUserPersistence(validatedUser);

  return newUser;
}
