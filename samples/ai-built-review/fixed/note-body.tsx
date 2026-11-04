export function NoteBody({ body }: { body: string }) {
  return (
    <div className="note-body" data-testid="note-body">
      {body}
    </div>
  );
}
