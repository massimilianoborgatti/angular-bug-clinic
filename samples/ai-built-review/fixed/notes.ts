import { NoteError, type NotesApi } from '../shared/notes';
function parseNote(payload: unknown) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload))
    throw new NoteError(400, 'Use a title and body.');
  const input = payload as Record<string, unknown>;
  if (
    Object.keys(input).some((key) => !['title', 'body'].includes(key)) ||
    typeof input.title !== 'string' ||
    typeof input.body !== 'string'
  )
    throw new NoteError(400, 'Only title and body are accepted.');
  const title = input.title.trim(),
    body = input.body.trim();
  if (title.length < 1 || title.length > 80 || body.length < 1 || body.length > 2000)
    throw new NoteError(400, 'Use a title of 1-80 and body of 1-2000 characters.');
  return { title, body };
}
export const api: NotesApi = {
  list(store, query, viewer) {
    return [...store.notes.values()].filter(
      (note) =>
        viewer.teamIds.includes(note.teamId) &&
        note.title.toLowerCase().includes(query.toLowerCase()),
    );
  },
  read(store, id, viewer) {
    const note = store.notes.get(id);
    if (!note) throw new NoteError(404, 'Note not found.');
    if (!viewer.teamIds.includes(note.teamId))
      throw new NoteError(403, 'This note belongs to another team.');
    return note;
  },
  create(store, payload, viewer) {
    if (!viewer.teamIds.length) throw new NoteError(403, 'Team membership required.');
    const input = parseNote(payload);
    const note = { ...input, id: store.nextId(), teamId: viewer.teamIds[0] };
    store.notes.set(note.id, note);
    return note;
  },
};
