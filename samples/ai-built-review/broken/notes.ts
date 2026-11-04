import { NoteError, type Note, type NotesApi } from '../shared/notes';
export const api: NotesApi = {
  list(store, query) {
    return [...store.notes.values()].filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase()),
    );
  },
  read(store, id) {
    const note = store.notes.get(id);
    if (!note) throw new NoteError(404, 'Note not found.');
    return note;
  },
  create(store, payload) {
    const note = Object.assign({ id: store.nextId(), teamId: 'team-blue' }, payload) as Note;
    store.notes.set(note.id, note);
    return note;
  },
};
