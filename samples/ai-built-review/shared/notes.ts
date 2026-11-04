export type Note = { id: string; teamId: string; title: string; body: string };
export type Viewer = { id: string; teamIds: readonly string[] };
export const demoViewer: Viewer = { id: 'demo-member', teamIds: ['team-blue'] };
export class NoteError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function createStore() {
  const notes = new Map<string, Note>([
    [
      'blue-note',
      {
        id: 'blue-note',
        teamId: 'team-blue',
        title: 'Welcome notes',
        body: 'Blue team planning notes.',
      },
    ],
    [
      'red-note',
      {
        id: 'red-note',
        teamId: 'team-red',
        title: 'Private planning',
        body: 'Red team planning notes.',
      },
    ],
  ]);
  let sequence = 0;
  return { notes, nextId: () => 'note-' + ++sequence };
}
export type Store = ReturnType<typeof createStore>;
export type NotesApi = {
  list: (store: Store, query: string, viewer: Viewer) => Note[];
  read: (store: Store, id: string, viewer: Viewer) => Note;
  create: (store: Store, payload: unknown, viewer: Viewer) => Note;
};
