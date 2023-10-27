export async function deleteGroupInteractor(
  deleteGroupPersistence: (id: string) => Promise<void>,
  id: string
): Promise<void> {
  await deleteGroupPersistence(id);
}
