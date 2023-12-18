export async function deleteCurrentHistoryAccountInteractor(
  deleteCurrentHistoryAccountPersistence: (authUserId: string) => Promise<any>,
  authUserId: string
): Promise<void> {
  await deleteCurrentHistoryAccountPersistence(authUserId);
}
