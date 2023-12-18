import { UserEntity, UserInterface } from '../../entity/UserEntity.js';

export async function updateCurrentUserInteractor(
  updateCurrentUserPersistence: (authUserId: string, user: UserInterface) => Promise<any>,
  { authUserId, user }: { authUserId: string; user: UserInterface }
): Promise<UserEntity> {
  // Create a new UserEntity instance
  user.isUpdating = true;

  const updatedUserObject = new UserEntity(user);

  // Check if username and password valid
  updatedUserObject.validate();

  // Update the user using the provided persistence function
  const updatedUser = await updateCurrentUserPersistence(authUserId, user);

  return updatedUser;
}
