export async function deleteUserInteractor(
  deleteUserPersistence: (id: string) => Promise<void>,
  id: string
): Promise<void> {
  await deleteUserPersistence(id);
}
