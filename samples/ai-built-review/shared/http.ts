import { createStore, demoViewer, NoteError, type NotesApi } from './notes';
export function handlers(api: NotesApi) {
  const store = createStore();
  async function respond(work: () => unknown | Promise<unknown>) {
    try {
      return Response.json(await work());
    } catch (error) {
      if (error instanceof NoteError)
        return Response.json({ error: error.message }, { status: error.status });
      if (error instanceof SyntaxError)
        return Response.json({ error: 'Use valid JSON.' }, { status: 400 });
      return Response.json({ error: 'The note could not be processed.' }, { status: 500 });
    }
  }
  return {
    GET: (request: Request) =>
      respond(() => {
        const params = new URL(request.url).searchParams;
        const id = params.get('id');
        return id
          ? { note: api.read(store, id, demoViewer) }
          : { notes: api.list(store, params.get('q') ?? '', demoViewer) };
      }),
    POST: (request: Request) =>
      respond(async () => ({ note: api.create(store, await request.json(), demoViewer) })),
  };
}
