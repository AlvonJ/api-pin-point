export async function deleteAttendanceInteractor(
  deleteAttendancePersistence: (id: string) => Promise<void>,
  id: string
): Promise<void> {
  await deleteAttendancePersistence(id);
}
